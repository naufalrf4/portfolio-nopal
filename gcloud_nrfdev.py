# /// script
# dependencies = ["paramiko"]
# ///

import os
import sys
import paramiko
from pathlib import Path
from typing import Tuple

_env_file = Path(__file__).parent / ".env"
if _env_file.exists():
    for _line in _env_file.read_text(encoding="utf-8").splitlines():
        _line = _line.strip()
        if _line and not _line.startswith("#") and "=" in _line:
            _k, _v = _line.split("=", 1)
            os.environ[_k.strip()] = _v.strip()  # .env overrides OS env

HOST = os.environ.get("SSH_HOST") or "34.142.218.199"
USER = os.environ.get("SSH_USER") or "naufalrf32"
PORT = int(os.environ.get("SSH_PORT", "22"))
KEY_PATH = os.environ.get("SSH_KEY_PATH") or str(Path.home() / ".ssh" / "google_compute_engine")
KEY_PASS = os.environ.get("SSH_KEY_PASS") or None

PATH_PREFIX = "export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin && "

GCLOUD_INSTANCE = os.environ.get("GCLOUD_INSTANCE") or "portfolio-prod"
GCLOUD_ZONE = os.environ.get("GCLOUD_ZONE") or "asia-southeast1-a"
GCLOUD_PROJECT = os.environ.get("GCLOUD_PROJECT") or "naufalrf-personal"
GCLOUD_BIN = os.environ.get("GCLOUD_BIN") or ("gcloud.cmd" if os.name == "nt" else "gcloud")
PREFER_GCLOUD = os.environ.get("SSH_PREFER_GCLOUD", "true").lower() == "true"


_stdout = open(sys.stdout.fileno(), "wb", closefd=False, buffering=0)
_stderr = open(sys.stderr.fileno(), "wb", closefd=False, buffering=0)


def _safe_print(data: bytes, stream):
    stream.write(data.replace(b"\r\n", b"\n").replace(b"\r", b"\n"))
    stream.flush()


def load_key():
    if not KEY_PATH:
        raise RuntimeError("SSH_KEY_PATH not set")
    try:
        return paramiko.Ed25519Key.from_private_key_file(KEY_PATH, password=KEY_PASS)
    except paramiko.ssh_exception.SSHException:
        pass
    try:
        return paramiko.RSAKey.from_private_key_file(KEY_PATH, password=KEY_PASS)
    except Exception as e:
        raise RuntimeError(f"Failed to load SSH key: {e}")



def run_via_gcloud(cmd: str) -> Tuple[str, str, int]:
    import subprocess

    result = subprocess.run(
        [
            GCLOUD_BIN,
            "compute",
            "ssh",
            f"{USER}@{GCLOUD_INSTANCE}",
            f"--zone={GCLOUD_ZONE}",
            f"--project={GCLOUD_PROJECT}",
            f"--command={cmd}",
        ],
        capture_output=True,
        text=True,
    )
    return result.stdout, result.stderr, result.returncode


def put_via_gcloud(local_path: str, remote_path: str):
    import subprocess

    target = f"{USER}@{GCLOUD_INSTANCE}:{remote_path}"
    result = subprocess.run(
        [
            GCLOUD_BIN,
            "compute",
            "scp",
            local_path,
            target,
            f"--zone={GCLOUD_ZONE}",
            f"--project={GCLOUD_PROJECT}",
        ],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr or result.stdout)


def connect(retries=3) -> paramiko.SSHClient:
    import socket as _socket
    import time
    key = load_key()
    for attempt in range(retries):
        client = None
        sock = None
        try:
            # Try plain paramiko first
            client = paramiko.SSHClient()
            client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            client.connect(
                hostname=HOST,
                port=PORT,
                username=USER,
                pkey=key,
                timeout=15,
                banner_timeout=30,
            )
            return client
        except Exception:
            if client:
                try: client.close()
                except: pass
            # Fallback: pre-connected AF_INET socket (for VPN bypass)
            try:
                sock = _socket.socket(_socket.AF_INET, _socket.SOCK_STREAM)
                sock.settimeout(30)
                sock.connect((HOST, PORT))
                client = paramiko.SSHClient()
                client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
                client.connect(
                    hostname=HOST,
                    port=PORT,
                    username=USER,
                    pkey=key,
                    timeout=15,
                    banner_timeout=30,
                    sock=sock,
                )
                return client
            except Exception as e:
                if client:
                    try: client.close()
                    except: pass
                if sock:
                    try: sock.close()
                    except: pass
                if attempt < retries - 1:
                    print(f'Attempt {attempt+1} failed, retrying...', file=sys.stderr)
                    time.sleep(2)
                else:
                    raise


def run(cmd: str, timeout: int = 300) -> Tuple[str, str, int]:
    if PREFER_GCLOUD:
        return run_via_gcloud(PATH_PREFIX + cmd)

    try:
        client = connect()
    except Exception:
        return run_via_gcloud(PATH_PREFIX + cmd)

    try:
        _, stdout, stderr = client.exec_command(
            PATH_PREFIX + cmd,
            timeout=timeout,
            get_pty=False,
        )
        out_bytes = stdout.read()
        err_bytes = stderr.read()
        code = stdout.channel.recv_exit_status()
    finally:
        client.close()

    out = out_bytes.decode("utf-8", errors="replace")
    err = err_bytes.decode("utf-8", errors="replace")
    return out, err, code


def put(local_path: str, remote_path: str):
    if PREFER_GCLOUD:
        put_via_gcloud(local_path, remote_path)
        return

    try:
        client = connect()
    except Exception:
        put_via_gcloud(local_path, remote_path)
        return

    try:
        sftp = client.open_sftp()
        sftp.put(local_path, remote_path)
        sftp.close()
    finally:
        client.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        _safe_print(b"usage: python gcloud_nrfdev.py <command>\n", _stderr)
        sys.exit(1)

    if sys.argv[1] == "put" and len(sys.argv) == 4:
        put(sys.argv[2], sys.argv[3])
        _safe_print(b"Upload OK\n", _stdout)
        sys.exit(0)

    cmd = " ".join(sys.argv[1:])
    out, err, code = run(cmd)

    if out:
        _safe_print(out.encode("utf-8", errors="replace"), _stdout)
    if err:
        _safe_print(err.encode("utf-8", errors="replace"), _stderr)

    sys.exit(code)

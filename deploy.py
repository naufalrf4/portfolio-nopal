# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "paramiko>=3.5.1",
# ]
# ///

from __future__ import annotations

import getpass
import posixpath
import shlex
import socket
import sys
import textwrap
from dataclasses import dataclass
from pathlib import Path

import paramiko

ROOT = Path(__file__).resolve().parent
DEFAULT_ENV_FILE = ROOT / ".env.docker.prod"
DEFAULT_REMOTE_ROOT = "/opt/portfolio-nopal"
DEFAULT_BRANCH = "main"


class DeployError(RuntimeError):
    pass


@dataclass(frozen=True)
class DeployConfig:
    host: str
    user: str
    port: int
    key_file: str | None
    repo_url: str
    branch: str
    remote_root: str
    env_file: Path
    first_deploy: bool
    bootstrap_host: bool
    skip_env_upload: bool
    strict_host_key: bool
    dry_run: bool
    bootstrap_only: bool


class ParamikoAdapter:
    def __init__(self, config: DeployConfig) -> None:
        self.config = config
        self.client = paramiko.SSHClient()
        self.client.load_system_host_keys()
        if config.strict_host_key:
            self.client.set_missing_host_key_policy(paramiko.RejectPolicy())
        else:
            self.client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    def __enter__(self) -> "ParamikoAdapter":
        if self.config.dry_run:
            return self
        kwargs: dict[str, object] = {
            "hostname": self.config.host,
            "port": self.config.port,
            "username": self.config.user,
            "timeout": 15,
            "auth_timeout": 15,
            "banner_timeout": 15,
            "look_for_keys": True,
            "allow_agent": True,
        }
        if self.config.key_file:
            kwargs["key_filename"] = self.config.key_file
        self.client.connect(**kwargs)
        return self

    def __exit__(self, exc_type, exc, tb) -> None:
        if not self.config.dry_run:
            self.client.close()

    def run(self, command: str, *, cwd: str | None = None, sudo: bool = False) -> None:
        full = command if not cwd else f"cd {shlex.quote(cwd)} && {command}"
        wrapped = f"sudo -n bash -lc {shlex.quote(full)}" if sudo else f"bash -lc {shlex.quote(full)}"
        if self.config.dry_run:
            print(f"[dry-run] {wrapped}")
            return
        _, stdout, stderr = self.client.exec_command(wrapped)
        status = stdout.channel.recv_exit_status()
        out = stdout.read().decode("utf-8", errors="replace")
        err = stderr.read().decode("utf-8", errors="replace")
        if status != 0:
            raise DeployError(f"Command failed ({status}): {wrapped}\nSTDOUT:\n{out}\nSTDERR:\n{err}")
        if out.strip():
            print(out.strip())

    def upload(self, local_path: Path, remote_path: str, mode: int = 0o600) -> None:
        if self.config.dry_run:
            print(f"[dry-run] upload {local_path} -> {remote_path} ({oct(mode)})")
            return
        remote_dir = posixpath.dirname(remote_path)
        self.run(f"mkdir -p {shlex.quote(remote_dir)}")
        with self.client.open_sftp() as sftp:
            sftp.put(str(local_path), remote_path)
            sftp.chmod(remote_path, mode)


def ask(prompt: str, default: str | None = None, secret: bool = False) -> str:
    label = f"{prompt}"
    if default:
        label += f" [{default}]"
    label += ": "
    value = getpass.getpass(label) if secret else input(label)
    value = value.strip()
    return value or (default or "")


def ask_bool(prompt: str, default: bool = False) -> bool:
    default_label = "Y/n" if default else "y/N"
    value = input(f"{prompt} [{default_label}]: ").strip().lower()
    if not value:
        return default
    return value in {"y", "yes", "true", "1"}


def print_help() -> None:
    print(
        textwrap.dedent(
            f"""
            Usage: uv run deploy.py

            Interactive prompts will ask for:
            - remote host / ssh user / ssh port / ssh key path
            - repo URL and branch
            - remote deploy root
            - local .env.docker.prod path
            - whether to bootstrap the host, upload env, run first-deploy bootstrap,
              use strict host key checking, and run in dry-run mode

            Existing production scripts used remotely:
            - bash ./scripts/docker-prod-bootstrap.sh
            - bash ./scripts/docker-prod-up.sh

            Default local env file: {DEFAULT_ENV_FILE}
            Default remote root: {DEFAULT_REMOTE_ROOT}
            Default branch: {DEFAULT_BRANCH}
            """
        ).strip()
    )


def collect_config() -> DeployConfig:
    env_file_raw = ask("Local env file to upload", str(DEFAULT_ENV_FILE))
    env_file = Path(env_file_raw)
    skip_env_upload = ask_bool("Skip .env.docker.prod upload", False)
    if not skip_env_upload and not env_file.exists():
        raise SystemExit(f"Env file not found: {env_file}")

    return DeployConfig(
        host=ask("Remote host or IP"),
        user=ask("SSH user", "deploy"),
        port=int(ask("SSH port", "22")),
        key_file=ask("SSH private key path (blank to use agent/default keys)") or None,
        repo_url=ask("Git repository URL accessible from the server"),
        branch=ask("Git branch to deploy", DEFAULT_BRANCH),
        remote_root=ask("Remote deploy root", DEFAULT_REMOTE_ROOT),
        env_file=env_file,
        first_deploy=ask_bool("Run first-deploy bootstrap flow", True),
        bootstrap_host=ask_bool("Install Docker/git/ufw and harden host", True),
        skip_env_upload=skip_env_upload,
        strict_host_key=not ask_bool("Allow auto-add SSH host key", False),
        dry_run=ask_bool("Dry run only", False),
        bootstrap_only=ask_bool("Bootstrap host and sync repo only (skip docker deploy)", False),
    )


def render_bootstrap_script(config: DeployConfig) -> str:
    return textwrap.dedent(
        f"""
        set -euo pipefail
        export DEBIAN_FRONTEND=noninteractive

        if ! command -v apt-get >/dev/null 2>&1; then
          echo 'Only Debian/Ubuntu bootstrap is supported by this adapter.' >&2
          exit 1
        fi

        sudo -n apt-get update
        sudo -n apt-get install -y ca-certificates curl git ufw fail2ban unattended-upgrades apt-listchanges

        if ! command -v docker >/dev/null 2>&1; then
          curl -fsSL https://get.docker.com | sudo -n sh
        fi

        if ! docker compose version >/dev/null 2>&1; then
          sudo -n apt-get install -y docker-compose-plugin
        fi

        sudo -n mkdir -p /etc/docker
        cat <<'JSON' | sudo -n tee /etc/docker/daemon.json >/dev/null
        {{
          "live-restore": true,
          "log-driver": "json-file",
          "log-opts": {{
            "max-size": "10m",
            "max-file": "3"
          }}
        }}
JSON
        sudo -n systemctl enable docker
        sudo -n systemctl restart docker
        sudo -n systemctl enable fail2ban
        sudo -n systemctl restart fail2ban
        sudo -n systemctl enable unattended-upgrades
        sudo -n systemctl restart unattended-upgrades || true
        sudo -n dpkg-reconfigure -f noninteractive unattended-upgrades || true

        sudo -n usermod -aG docker {shlex.quote(config.user)} || true
        sudo -n mkdir -p {shlex.quote(config.remote_root)}
        sudo -n chown -R {shlex.quote(config.user)}:{shlex.quote(config.user)} {shlex.quote(config.remote_root)}

        sudo -n ufw --force reset
        sudo -n ufw default deny incoming
        sudo -n ufw default allow outgoing
        sudo -n ufw allow OpenSSH
        sudo -n ufw allow 80/tcp
        sudo -n ufw allow 443/tcp
        sudo -n ufw allow 443/udp
        sudo -n ufw --force enable
        """
    ).strip()


def ensure_remote_repo(adapter: ParamikoAdapter, config: DeployConfig) -> None:
    remote_git = posixpath.join(config.remote_root, ".git")
    try:
        adapter.run(f"test -d {shlex.quote(remote_git)}")
    except DeployError:
        adapter.run(f"mkdir -p {shlex.quote(config.remote_root)}")
        adapter.run(f"git clone {shlex.quote(config.repo_url)} {shlex.quote(config.remote_root)}")

    adapter.run("git fetch --all --prune", cwd=config.remote_root)
    adapter.run(f"git checkout {shlex.quote(config.branch)}", cwd=config.remote_root)
    adapter.run(f"git pull --ff-only origin {shlex.quote(config.branch)}", cwd=config.remote_root)


def deploy(config: DeployConfig) -> None:
    print("\nDeploy summary")
    print(f"- Host: {config.user}@{config.host}:{config.port}")
    print(f"- Branch: {config.branch}")
    print(f"- Repo: {config.repo_url}")
    print(f"- Remote root: {config.remote_root}")
    print(f"- Env upload: {'skip' if config.skip_env_upload else config.env_file}")
    print(f"- Host bootstrap: {'yes' if config.bootstrap_host else 'no'}")
    print(f"- Mode: {'bootstrap' if config.first_deploy else 'steady-state update'}")
    print(f"- Host key policy: {'strict' if config.strict_host_key else 'auto-add'}")
    print(f"- Bootstrap only: {'yes' if config.bootstrap_only else 'no'}")

    with ParamikoAdapter(config) as adapter:
        adapter.run("uname -a")

        if config.bootstrap_host:
            local_bootstrap = ROOT / ".deploy-bootstrap.tmp.sh"
            local_bootstrap.write_text(render_bootstrap_script(config), encoding="utf-8", newline="\n")
            try:
                adapter.upload(local_bootstrap, "/tmp/portfolio-bootstrap.sh", mode=0o700)
                adapter.run("/tmp/portfolio-bootstrap.sh")
            finally:
                if local_bootstrap.exists():
                    local_bootstrap.unlink()

        ensure_remote_repo(adapter, config)

        if not config.skip_env_upload:
            adapter.upload(
                config.env_file,
                posixpath.join(config.remote_root, ".env.docker.prod"),
                mode=0o600,
            )

        if not config.bootstrap_only:
            deploy_command = (
                "bash ./scripts/docker-prod-bootstrap.sh"
                if config.first_deploy
                else "bash ./scripts/docker-prod-up.sh"
            )
            adapter.run(deploy_command, cwd=config.remote_root)
            adapter.run("docker compose ps", cwd=config.remote_root)
            adapter.run("docker system df")

    print("\nDeployment completed successfully.")


def main() -> int:
    if any(arg in {"-h", "--help"} for arg in sys.argv[1:]):
        print_help()
        return 0

    config = collect_config()
    deploy(config)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (DeployError, paramiko.SSHException, socket.error, ValueError) as error:
        print(str(error), file=sys.stderr)
        raise SystemExit(1)

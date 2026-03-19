import asyncio

from sqlalchemy import text

from app.db.session import engine


async def main() -> None:
    async with engine.begin() as connection:
        await connection.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await connection.execute(text("CREATE SCHEMA IF NOT EXISTS rag"))

    await engine.dispose()
    print("RAG schema bootstrap completed.")


if __name__ == "__main__":
    asyncio.run(main())

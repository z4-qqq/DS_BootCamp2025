import asyncpg

db_pool: asyncpg.Pool = None


def get_db_pool() -> asyncpg.Pool:
    if db_pool is None:
        raise RuntimeError("Database pool not initialized")
    return db_pool

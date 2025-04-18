from app.infrastructure import AsyncPgProvider


class EvaluateAsyncPgRepository:
    def __init__(self, provider: AsyncPgProvider) -> None:
        self.provider = provider

    async def get_evaluate_list(
        self, username: str, limit: int = 10, offset: int = 0
    ): ...

import typing
from app.infrastructure import DatabaseProviderProtocol


class RepositoryProtocol(typing.Protocol):
    def __init__(self, provider: DatabaseProviderProtocol):
        self.provider = provider

    async def save(self, *args, **kwargs) -> typing.Any: ...

    async def get(self, *args, **kwargs) -> typing.Any: ...

    async def delete(self, *args, **kwargs) -> typing.Any: ...

    async def update(self, *args, **kwargs) -> typing.Any: ...

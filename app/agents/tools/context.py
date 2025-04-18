from agents import function_tool, RunContextWrapper

@function_tool
async def context(ctx: RunContextWrapper[None]) -> list[dict[str, str]]:
    """Использует конекст всего диалога"""

    history = ctx.context.get("chat_history", [])
    return history
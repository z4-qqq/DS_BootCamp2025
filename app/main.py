import hashlib
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import AsyncGenerator

import asyncpg
from fastapi import FastAPI, Form, Request, Query
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from jose import jwt

from app.api.evaluation import router as evaluation_router
from app.api.interview import router as interview_router, get_hint_by_agent
from app.settings import settings
from pydantic import BaseModel
from typing import List

db_pool: asyncpg.Pool = None


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    global db_pool
    db_pool = await asyncpg.create_pool(dsn=settings.POSTGRES_DSN)

    async with db_pool.acquire() as conn:
        await conn.execute(f"""
        CREATE TABLE IF NOT EXISTS {settings.DB_SCHEMA}.{settings.DB_TABLE}(
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

    yield
    await db_pool.close()


app = FastAPI(lifespan=lifespan)


app.mount("/frontend", StaticFiles(directory="app/frontend"), name="frontend")

# Инициализируем роутеры для API
app.include_router(evaluation_router)
app.include_router(interview_router)
app.state.feedback_result = None

# Templates for frontend
templates = Jinja2Templates(directory="app/frontend")


# Роуты для отображения HTML страницы
@app.get("/")
async def root():
    return RedirectResponse(url="/login")


@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@app.post("/api/login")
async def login(username: str = Form(...), password: str = Form(...)):
    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    async with db_pool.acquire() as conn:
        user = await conn.fetchrow(
            f"""
        SELECT * FROM {settings.DB_SCHEMA}.{settings.DB_TABLE} WHERE username = $1
        """,
            username,
        )
        if user:
            if user["hashed_password"] != hashed_password:
                return JSONResponse(
                    status_code=401, content={"error": "Неверный пароль"}
                )
        else:
            await conn.execute(
                f"""
            INSERT INTO {settings.DB_SCHEMA}.{settings.DB_TABLE} (username, hashed_password)
            VALUES ($1, $2)
            """,
                username,
                hashed_password,
            )
        payload = {
            "sub": username,
            "exp": datetime.utcnow()
            + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        }
        access_token = jwt.encode(
            payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM
        )
        return {"access_token": access_token}


@app.get("/select-persona", response_class=HTMLResponse)
async def select_persona_page(request: Request):
    return templates.TemplateResponse("select-candidate.html", {"request": request})


@app.get("/interview", response_class=HTMLResponse)
async def interview_page(request: Request):
    return templates.TemplateResponse("interview.html", {"request": request})


@app.get("/evaluation", response_class=HTMLResponse)
async def evaluation_page(request: Request):
    return templates.TemplateResponse("evaluation.html", {"request": request})


@app.get("/report", response_class=HTMLResponse)
async def report_page(request: Request):
    return templates.TemplateResponse("report.html", {"request": request})


class Message(BaseModel):
    role: str
    content: str

class HintRequest(BaseModel):
    persona: str
    skill: str
    messages: List[Message]

@app.post("/api/hint")
async def get_hint(request: HintRequest):
    messages = [m.model_dump() for m in reversed(request.messages)]
    hint = await get_hint_by_agent(persona=request.persona, skill=request.skill, messages=messages)
    return JSONResponse(content={"hint": hint})

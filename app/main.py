import hashlib
from datetime import datetime, timedelta

from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from jose import jwt

from app.api.evaluation import router as evaluation_router
from app.api.interview import router as interview_router

app = FastAPI()

app.mount("/frontend", StaticFiles(directory="app/frontend"), name="frontend")

simple_db = {"user": hashlib.sha256("pass".encode()).hexdigest()}

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# Инициализируем роутеры для API
app.include_router(evaluation_router)
app.include_router(interview_router)

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
    stored_password = simple_db.get(username)
    if stored_password and stored_password == hashed_password:
        payload = {
            "sub": username,
            "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        }
        access_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return {"access_token": access_token}
    else:
        return JSONResponse(
            status_code=401,
            content={"error": "Неверный логин или пароль"},
        )


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

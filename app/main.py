from datetime import datetime, timedelta

from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from jose import jwt
from passlib.context import CryptContext

from app.api.evaluation import router as evaluation_router
from app.api.interview import router as interview_router

app = FastAPI()

fake_users_db = {
    "user@example.com": {
        "username": "user@example.com",
        "hashed_password": "$2b$12$UU7U9I2J8PiBFu1qnb0l6.QmY28rqMTj03dzDew1FwEtMSVRnUzXa",  # lantenak
    }
}

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


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
    user = fake_users_db.get(username)
    if not user or not verify_password(password, user["hashed_password"]):
        return JSONResponse(status_code=401, content={"error": "Invalid credentials"})

    access_token = jwt.encode(
        {
            "sub": username,
            "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        },
        SECRET_KEY,
        algorithm=ALGORITHM,
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

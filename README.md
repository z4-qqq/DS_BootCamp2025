# **Interviewee Agent**

![Deploy](https://github.com/dimadem/ai-agent-conversation/actions/workflows/digitalocean-deploy.yml/badge.svg)

#### **requirenments.txt**
[FASTAPI](https://fastapi.tiangolo.com/)

[UVICORN](https://pypi.org/project/uvicorn/)

[OPENAI](https://platform.openai.com/docs/api-reference/responses)

[OPENAI AGENT SDK](https://openai.github.io/openai-agents-python/)

[OPENAI FM](https://www.openai.fm/)

---

### **Setup**

1. собрать проект -> ./setup.sh
2. добавить нужные ключи в .env файл
3. запустить проект -> ./dev.sh

---

### **Deploy**

1. В репозитории -> Settings
2. Secrets and Variables -> Repository secrets
3. DROPLET_IP -> current ip
4. DROPLET_PASSWORD -> current password
5. OPENAI_API_KEY -> current openai api key

### **Development**
1. ssh root@ip -> password
2. install deps
```
apt-get update
apt-get install -y --no-install-recommends \
    curl \
    gnupg2 \
    ca-certificates \
    lsb-release \
    git \
    python3 \
    python3-venv \
    software-properties-common
```
3. git pull
4. VS Code -> SSH connect with `https://code.visualstudio.com/docs/remote/ssh-tutorial`
5. ./dev.sh -> open server as a localhost, VS Code handles all port redirections
6. enjoy

---

### **Описание**

```
⎿  📁 app
     ├─ 📄 __init__.py
     ├─ 📁 agents                <!-- Агенты для различных задач -->
     │  ├─ 📄 evaluation_agent.py
     │  ├─ 📄 interviewee_agent.py
     │  ├─ 📁 prompts            <!-- Шаблоны и утилиты для агентов -->
     │  │  ├─ 📄 __init__.py
     │  │  ├─ 📄 evaluation_system_prompt.yaml
     │  │  ├─ 📄 persona_system_prompt.yaml
     │  │  ├─ 📄 utils.py
     │  ├─ 📁 tools              <!-- Инструменты для агентов -->
     │  │  ├─ 📄 extract_action.py
     │  │  ├─ 📄 extract_result.py
     │  │  ├─ 📄 extract_situation.py
     │  │  ├─ 📄 extract_task.py
     │  │  ├─ 📄 lie_answer.py
     ├─ 📁 api                   <!-- API для взаимодействия с фронтендом -->
     │  ├─ 📄 __init__.py
     │  ├─ 📄 evaluation.py
     │  ├─ 📄 interview.py
     ├─ 📁 core                  <!-- Основные конфигурации и константы -->
     │  ├─ 📄 __init__.py
     │  ├─ 📄 config.py
     │  ├─ 📄 constants.py
     │  ├─ 📄 openai.py
     ├─ 📁 frontend              <!-- HTML файлы для фронтенда -->
     │  ├─ 📄 evaluation.html
     │  ├─ 📄 index.html
     │  ├─ 📄 interview.html
     │  ├─ 📄 report.html
     │  ├─ 📄 select-candidate.html
     ├─ 📄 main.py               <!-- Главный файл запуска приложения -->
     ├─ 📁 model                 <!-- Модели для обработки данных -->
     │  ├─ 📄 __init__.py
     │  ├─ 📄 stt.py
     │  ├─ 📄 tts.py
     │  ├─ 📄 ttt.py
     ├─ 📁 utils                 <!-- Утилиты и вспомогательные функции -->
     │  └─ 📄 __init__.py
```

---
# Poetry
1. Необходимо выполнить команду`poetry env use python` для создания окружения
2. Перейти в окружение и выполнить `poetry install`

# Docker
1. Указать ключ как перемнную окружения`export OPENAI_API_KEY=`
2. Выполнить команду `docker compose up -d` чтоб запустить контейнер с приложением

Так-же поднимется контейнер с постгресом который будет недоступен для подключения из вне сети докера
Чтоб можно было ей пользоваться локально - надо добавить в описание сервиса `postgres` в `docker-compose.yml`
```yaml
ports:
  - "5432:5432"
```
Не добавляйте это в МР, контейнер с базой в таком случае будет доступен из сети по этому порту и с дефолтными кредами превратиться в тыкву
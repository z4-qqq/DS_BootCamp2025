FROM python:3.12-slim AS builder

ENV PIP_NO_CACHE_DIR=off
ENV PIP_DISABLE_PIP_VERSION_CHECK=on
ENV PIP_DEFAULT_TIMEOUT=100
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV POSTGRES_DSN=$POSTGRES_DSN


RUN groupadd --gid 2000 python
RUN useradd --uid 2000 --gid python --shell /usr/sbin/nologin --create-home python

RUN apt-get update
RUN pip install --no-cache-dir poetry

COPY pyproject* ./
COPY poetry.lock ./

RUN poetry config virtualenvs.create false
RUN poetry config installer.max-workers 10
RUN poetry install --no-root --all-extras
RUN poetry cache clear pypi --all

RUN pip uninstall pipenv poetry -y

RUN ROOTDIRS=$(find / -maxdepth 1 -mindepth 1 \( -type d -o -type l \)  ! -name builds ! -name busybox ! -name dev ! -name etc ! -name kaniko ! -name proc ! -name sys ! -name tmp ! -name var ! -name workspace) \
    && mkdir -p /rootfs/dev /rootfs/proc /rootfs/run /rootfs/tmp \
    && cp -ax /etc/ /var /rootfs \
    && rm -rf /rootfs/var/run \
    && mv $ROOTDIRS /rootfs/


FROM scratch AS runtime-image

ENV LANG="C.UTF-8" \
    PYTHONUNBUFFERED=1 \
    WORKDIR=/srv/www/
WORKDIR $WORKDIR

COPY --from=builder /rootfs/ /
COPY . .

RUN chown python:python /srv /tmp -R
USER python:python
ENTRYPOINT ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port 8000"]
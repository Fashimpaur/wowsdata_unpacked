# syntax=docker/dockerfile:1

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install build dependencies only when needed (many wheels don’t require them)
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
    && rm -rf /var/lib/apt/lists/*

# ---- PIP CACHE FOR FASTER BUILDS ----
# Use BuildKit mount to persist pip cache and speed up rebuilds
RUN python -m pip install --upgrade pip

COPY requirements.txt .

RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt

# -------------------------------------

COPY . .

# Ensure startup script is executable
RUN chmod +x ./start.sh

EXPOSE 8000

CMD ["./start.sh"]


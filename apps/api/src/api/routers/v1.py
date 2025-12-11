from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("/health")
def health() -> dict:
    return {"status": "ok"}


# --- OAuth placeholders (to be wired to a real provider via Authlib) ---
@router.get("/auth/login")
def oauth_login() -> JSONResponse:
    # In a real app, redirect to provider authorization URL with state
    return JSONResponse({"message": "OAuth login not yet configured"}, status_code=501)


@router.get("/auth/callback")
def oauth_callback() -> JSONResponse:
    # In a real app, exchange code for tokens and issue session/JWT
    return JSONResponse({"message": "OAuth callback not yet implemented"}, status_code=501)

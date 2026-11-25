import jwt
from jwt import PyJWKClient
from fastapi import HTTPException, Request

from app.config import settings

_jwks_client: PyJWKClient | None = None


def _client() -> PyJWKClient:
    global _jwks_client
    if _jwks_client is None:
        _jwks_client = PyJWKClient(f"https://{settings.auth0_domain}/.well-known/jwks.json")
    return _jwks_client


def require_user(request: Request) -> dict:
    if not settings.auth0_domain or not settings.auth0_audience:
        return {"sub": None}

    header = request.headers.get("authorization", "")
    if not header.startswith("Bearer "):
        raise HTTPException(401, "Missing bearer token.")

    token = header.split(" ", 1)[1]
    try:
        signing_key = _client().get_signing_key_from_jwt(token).key
        return jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            audience=settings.auth0_audience,
            issuer=f"https://{settings.auth0_domain}/",
        )
    except Exception as exc:
        raise HTTPException(401, f"Invalid token: {exc}")

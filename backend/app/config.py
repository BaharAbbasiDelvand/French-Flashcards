from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    anthropic_api_key: str = ""
    model_quality: str = "claude-opus-4-8"
    model_bulk: str = "claude-haiku-5-5"
    cors_origins: str = "http://localhost:5173"
    auth0_domain: str = ""
    auth0_audience: str = ""


settings = Settings()

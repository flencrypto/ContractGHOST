"""Application settings loaded from environment variables."""

import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # AI / LLM
    XAI_API_KEY: str = ""

    # CORS – comma-separated list of allowed origins.
    # Example: "https://app.example.com,https://preview.example.com"
    CORS_ORIGINS: str = "http://localhost:3000"

    # Database
    DATABASE_URL: str = "sqlite:///./align.db"

    # Authentication  (none | clerk | auth0)
    AUTH_PROVIDER: str = "none"
    CLERK_ISSUER: str = ""
    CLERK_JWKS_URL: str = ""
    AUTH0_DOMAIN: str = ""
    AUTH0_AUDIENCE: str = ""

    # File storage  (local | s3)
    STORAGE_BACKEND: str = "local"
    UPLOAD_DIR: str = "./uploads"
    S3_BUCKET: str = ""
    S3_REGION: str = "eu-west-2"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()

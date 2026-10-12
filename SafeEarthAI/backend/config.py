"""Environment-based configuration. All secrets come from environment variables (.env in development)."""
import os

from dotenv import load_dotenv

load_dotenv()


def _csv(value: str) -> list[str]:
    return [v.strip() for v in value.split(",") if v.strip()]


class BaseConfig:
    APP_ENV = "development"
    APP_VERSION = "1.0.0"
    DEBUG = False
    TESTING = False
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
    CORS_ORIGINS = _csv(os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"))
    APP_USER_AGENT = os.getenv("APP_USER_AGENT", "SafeEarthAI/1.0")
    LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini")
    LLM_API_KEY = os.getenv("LLM_API_KEY", "")
    LLM_MODEL = os.getenv("LLM_MODEL", "")
    FIRMS_MAP_KEY = os.getenv("FIRMS_MAP_KEY", "")


class DevelopmentConfig(BaseConfig):
    DEBUG = True


class TestingConfig(BaseConfig):
    APP_ENV = "testing"
    TESTING = True
    LLM_API_KEY = ""
    LLM_MODEL = ""
    FIRMS_MAP_KEY = ""


class ProductionConfig(BaseConfig):
    APP_ENV = "production"


CONFIG_MAP = {"development": DevelopmentConfig, "testing": TestingConfig, "production": ProductionConfig}

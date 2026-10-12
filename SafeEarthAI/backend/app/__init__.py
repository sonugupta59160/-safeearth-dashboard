"""SafeEarth AI backend: application factory."""
import logging
import os

from flask import Flask
from flask_cors import CORS

from config import CONFIG_MAP

from .utils.errors import register_error_handlers


def create_app(config_name: str | None = None) -> Flask:
    config_name = config_name or os.getenv("APP_ENV", "development")
    config_class = CONFIG_MAP.get(config_name)
    if config_class is None:
        raise ValueError(f"Unknown APP_ENV '{config_name}'. Choose one of: {', '.join(CONFIG_MAP)}")

    app = Flask(__name__)
    app.config.from_object(config_class)
    logging.basicConfig(level=app.config["LOG_LEVEL"], format="%(asctime)s %(levelname)s [%(name)s] %(message)s")

    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})
    register_error_handlers(app)

    from .routes.assistant import bp as assistant_bp
    from .routes.geo import bp as geo_bp
    from .routes.health import bp as health_bp
    from .routes.wildfires import bp as wildfires_bp

    for bp in (health_bp, assistant_bp, geo_bp, wildfires_bp):
        app.register_blueprint(bp)
    return app

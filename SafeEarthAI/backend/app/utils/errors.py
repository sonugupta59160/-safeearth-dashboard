"""Consistent JSON errors. Internal details are logged, never leaked to the client."""
from flask import jsonify
from werkzeug.exceptions import HTTPException


class APIError(Exception):
    def __init__(self, message: str, status_code: int = 400, code: str = "bad_request"):
        super().__init__(message)
        self.message, self.status_code, self.code = message, status_code, code


def _body(code: str, message: str) -> dict:
    return {"ok": False, "error": {"code": code, "message": message}}


def register_error_handlers(app) -> None:
    @app.errorhandler(APIError)
    def _api(err: APIError):
        return jsonify(_body(err.code, err.message)), err.status_code

    @app.errorhandler(HTTPException)
    def _http(err: HTTPException):
        return jsonify(_body((err.name or "error").lower().replace(" ", "_"), err.description)), err.code

    @app.errorhandler(Exception)
    def _unexpected(err: Exception):
        app.logger.error("Unhandled error: %s", type(err).__name__)
        return jsonify(_body("internal_error", "An unexpected error occurred.")), 500

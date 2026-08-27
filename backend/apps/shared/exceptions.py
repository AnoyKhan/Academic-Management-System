from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return response

    data = response.data
    message = response.status_text or "Request failed."
    errors = {}

    if isinstance(data, dict):
        if "detail" in data:
            message = str(data["detail"])
            errors = {key: value for key, value in data.items() if key != "detail"}
        else:
            message = "Validation error." if response.status_code == 400 else message
            errors = data
    else:
        message = "Validation error." if response.status_code == 400 else message
        errors = {"non_field_errors": data}

    response.data = {
        "success": False,
        "message": message,
        "errors": errors,
    }
    return response

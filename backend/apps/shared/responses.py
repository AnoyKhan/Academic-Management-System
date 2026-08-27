from rest_framework import status
from rest_framework.response import Response


def success_response(message, data=None, status_code=status.HTTP_200_OK):
    return Response(
        {
            "success": True,
            "message": message,
            "data": {} if data is None else data,
        },
        status=status_code,
    )

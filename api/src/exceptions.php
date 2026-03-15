<?php

class HttpException extends Exception {
    public int $statusCode;
}

class BadRequestException extends HttpException{
    public int $statusCode = 400;
}

class UnauthorizedException extends HttpException{
    public int $statusCode = 401;
}

class ForbiddenException extends HttpException{
    public int $statusCode = 403;
}

class NotFoundException extends HttpException{
    public int $statusCode = 404;
}

class UnprocessableEntityException extends HttpException{
    public int $statusCode = 422;
}


class InternalServerError extends HttpException{
    public int $statusCode = 500;
}

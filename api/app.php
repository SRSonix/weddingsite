<?php

require_once 'controllers/base.php';

_empty_line();
_empty_line();

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url(url: $_SERVER['REQUEST_URI'], component: PHP_URL_PATH);

$router = new Router();
$router->add_route(pattern: '/health', callback: function(): array {
	http_response_code(response_code: 200);
    	return ["status" => "up"];
    }
);
$router->add_route(pattern: '/auth/users/(.*)/token', callback: "AuthController\generate_session_token");
$router->add_route(pattern: '/auth/session/(.*)/validate', callback: "AuthController\\validate");

$router->route(path: $path);

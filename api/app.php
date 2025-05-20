<?php

require_once 'controllers/base.php';
require_once 'controllers/request.php';
require_once 'controllers/user.php';
require_once 'middleware/auth.php';

_empty_line();
_empty_line();

$request = new Request();
$router = new Router();

$router->add_route(pattern: '/health', method: GET, callback: function(...$args): array {
		http_response_code(response_code: 200);
    	return ["status" => "up"];
    }
);
$router->add_route(pattern: '/users', method: POST, callback: "UserController\\create_user");
$router->add_route(pattern: "/users", method: GET, callback:"UserController\\get_user");
$router->add_route(pattern: "/auth/login", method: POST, callback:"AuthController\\login");

$router->add_middleware("resolve_user");

$router->route($request);

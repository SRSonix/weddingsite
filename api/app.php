<?php

require_once 'controllers/base.php';
require_once 'controllers/request.php';
require_once 'controllers/user.php';
require_once 'middleware/auth.php';

_empty_line();
_empty_line();

$request = new Request();
$router = new Router();

$router->add_route(pattern: '/health', method: GET, parameter_names: [], callback: function(...$args): array {
		http_response_code(response_code: 200);
    	return ["status" => "up"];
    }
);
$router->add_route(pattern: '^/user$', method: POST, parameter_names: [], callback: "UserController\\create_user");
$router->add_route(pattern: "^/user$", method: GET, parameter_names: [], callback:"UserController\\get_user");
$router->add_route(pattern: "^/user\/(\d+)$", method: DELETE, parameter_names: ["user_id"], callback:"UserController\\delete_user");
$router->add_route(pattern: "^/user\/(\d+)\/rsvp$", method: PUT, parameter_names: ["user_id"], callback:"UserController\\update_user_rsvp");
$router->add_route(pattern: "^/user\/(\d+)\/core_info$", method: PUT, parameter_names: ["user_id"], callback:"UserController\\update_user_core_info");
$router->add_route(pattern: "^/user\/(\d+)\/reset_token$", method: PUT, parameter_names: ["user_id"], callback:"UserController\\update_user_token");
$router->add_route(pattern: "^/user\/(\d+)\/token$", method: GET, parameter_names: ["user_id"], callback:"UserController\\get_user_token");
$router->add_route(pattern: "^/users$", method: GET, parameter_names: [], callback:"UserController\\get_all_users");
$router->add_route(pattern: "^/auth/login$", method: POST, parameter_names: [], callback:"AuthController\\login");
$router->add_route(pattern: "^/auth/logout$", method: POST, parameter_names: [], callback:"AuthController\\logout");
$router->add_route(pattern: "^/info/overview$", method: GET, parameter_names: [], callback:"InfoController\\get_overview");
$router->add_route(pattern: "^/image\/(.+)$", method: GET, parameter_names: ["image_path"], callback:"ImageController\\get_image");

$router->add_middleware("resolve_user");

$router->route($request);

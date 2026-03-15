<?php

require_once 'controllers/base/base.php';
require_once 'controllers/base/request.php';
require_once 'controllers/base/response.php';

function app($request): Response{
	_empty_line();
	_empty_line();

	$router = new Router();
	$router->add_route(pattern: '/health', method: GET, parameter_names: [], callback: function(...$args): Response {
			return new Response(
				body:["status" => "up"]
			);
		}
	);

	$router->add_route(pattern: '^/user$', method: POST, parameter_names: [], callback: "UserController\\create_user");
	$router->add_route(pattern: "^/user$", method: GET, parameter_names: [], callback:"UserController\\get_user");
	$router->add_route(pattern: "^/user\/(\d+)$", method: DELETE, parameter_names: ["user_id"], callback:"UserController\\delete_user");
	$router->add_route(pattern: "^/user\/(\d+)\/rsvp$", method: PUT, parameter_names: ["user_id"], callback:"UserController\\update_user_rsvp");
	$router->add_route(pattern: "^/user\/(\d+)\/core-info$", method: PUT, parameter_names: ["user_id"], callback:"UserController\\update_user_core_info");
	$router->add_route(pattern: "^/user\/(\d+)\/reset-token$", method: PUT, parameter_names: ["user_id"], callback:"UserController\\update_user_token");
	$router->add_route(pattern: "^/users$", method: GET, parameter_names: [], callback:"UserController\\get_all_users");

	$router->add_route(pattern: "^/user\/(\d+)\/family-member$", method: POST, parameter_names: ["user_id"], callback:"UserController\\add_family_member");
	$router->add_route(pattern: "^/user\/(\d+)\/family-member\/(\d+)$", method: PUT, parameter_names: ["user_id", "family_member_id"], callback:"UserController\\update_family_member");
	$router->add_route(pattern: "^/user\/(\d+)\/family-member\/(\d+)$", method: DELETE, parameter_names: ["user_id", "family_member_id"], callback:"UserController\\delete_family_member");

	$router->add_route(pattern: "^/auth/login$", method: POST, parameter_names: [], callback:"AuthController\\login");
	$router->add_route(pattern: "^/auth/logout$", method: POST, parameter_names: [], callback:"AuthController\\logout");

	$router->add_route(pattern: "^/info/overview$", method: GET, parameter_names: [], callback:"InfoController\\get_overview");
	$router->add_route(pattern: "^/info/agenda$", method: GET, parameter_names: [], callback:"InfoController\\get_agenda");
	$router->add_route(pattern: "^/info/payment-details$", method: GET, parameter_names: [], callback:"InfoController\\get_payment_details");

	$router->add_route(pattern: "^/image\/(.+)$", method: GET, parameter_names: ["image_path"], callback:"ImageController\\get_image");

	$router->add_middleware("resolve_user");
	$router->add_middleware("add_cors");

	return $router->route($request);
}

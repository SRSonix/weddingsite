<?php

require_once "helper.php";
require_once 'controllers/auth.php';

class Router {
    private $routes;
    private $middlewares;

    public function add_route($pattern, $callback): void {
        $this->routes[$pattern] = $callback;
    }

    public function route(string $path, array $params): void {
        _log("ROUTING: ". $path);

        foreach ($this->routes as $pattern => $callback) {
            if (preg_match(pattern: "#^$pattern$#", subject: $path, matches: $matches)) {
                array_shift(array: $matches); // Remove the full match
                $matches["params"] = $params;
                header(header: 'Content-Type: application/json');
                echo json_encode(value: call_user_func_array(callback: $callback, args: $matches));
                exit;
            }
        }

        http_response_code(response_code: 404);
        echo "404 Not Found";
    }
}

?>
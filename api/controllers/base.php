<?php

require_once "helper.php";
require_once 'controllers/auth.php';
require_once 'controllers/request.php';
require_once 'middleware/auth.php';

class Router {
    private $routes = array();
    private $middlewares = array();

    public function add_route($pattern, $method, $callback): void {
        $this->routes[$method][$pattern] = $callback;
    }

    public function add_middleware($callback): void {
        $this->middlewares[] = $callback;
    }

    public function route(Request $request): void {
        _log("ROUTING: ". $request->path);

        foreach ($this->routes[$request->method] as $pattern => $callback) {
            if (preg_match(pattern: "#^$pattern$#", subject: $request->path, matches: $matches)) {
                array_shift(array: $matches); // Remove the full match
                $args = $matches;

                $request = $this->run_middleware_chain($request);
                $args["request"] = $request;

                header(header: 'Content-Type: application/json');    
            	header('Access-Control-Allow-Credentials: true');
               
                if (in_array($request->origin, ["http://localhost:5173", "http://127.0.0.1:5173", "litte-mexincan-wedding.info"])){
                    header("Access-Control-Allow-Origin: $request->origin");
                    _log("known origin... setting CORS");
                }
                echo json_encode(value: call_user_func_array(callback: $callback, args: $args));
                exit;
            }
        }

        http_response_code(response_code: 404);
        echo "404 Not Found";
    }

    private function run_middleware_chain(Request $request): Request {
        foreach ($this->middlewares as $callback) {
            $request = $callback($request);
        }

        return $request;
    }
}
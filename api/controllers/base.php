<?php

require_once "helper.php";
require_once 'controllers/auth.php';
require_once 'controllers/request.php';
require_once 'controllers/info.php';
require_once 'controllers/image.php';
require_once 'middleware/auth.php';
require_once 'middleware/cors.php';
require_once "secrets/config.php";

class Router {
    private $routes = array();
    private $middlewares = array();

    public function add_route($pattern, $method, Array $parameter_names, $callback): void {
        $this->routes[$method][$pattern] = [$callback, $parameter_names];
    }

    public function add_middleware($callback): void {
        $this->middlewares[] = $callback;
    }

    public function route(Request $request): void {
        _log("ROUTING: ". $request->path);
        _log("origin: ". $request->origin);

        foreach ($this->routes[$request->method] as $pattern => [$callback, $parameter_names]) {            
            if (preg_match(pattern: "#^$pattern$#", subject: $request->path, matches: $matches)) {
                for ($i = 0; $i < count($parameter_names); $i++) {
                    _log($i.": ".$parameter_names[$i]."=".$matches[$i+1]);
                    $request->path_params[$parameter_names[$i]] = $matches[$i+1]; # first element is the full match
                }

                $request = $this->run_middleware_chain($request);
                $args["request"] = $request;
                
                # TODO: this is not nice and requires hacks when non json is returned. better move to individual controllers
                header('Content-Type: application/json');    
                try{
                    echo json_encode(value: call_user_func_array(callback: $callback, args: $args));
                }
                catch (HttpException $e){
                    _log($e);

                    http_response_code($e->statusCode);
                    echo json_encode(value: ["message" => $e->getMessage()]);
                }
                exit;
            }
        }
        
        _log("no route was matching ". $request->path);
        header('Content-Type: application/text');    
        http_response_code(response_code: 404);
        echo "404 Not Found";
        exit;
    }

    private function run_middleware_chain(Request $request): Request {
        foreach ($this->middlewares as $callback) {
            $request = $callback($request);
        }

        return $request;
    }
}
<?php

const POST = "POST";
const PUT = "PUT";
const GET = "GET";
const PATCH = "PATCH";
const DELETE = "DELETE";

class Request {
    public $origin;
    public $path;
    public $query_params;
    public $path_params;
    public $method;
    public $body;
    public $headers;
    public $cookies;
    public $user_id;
    public $user_role;

    public static function fromSuperGlobals(){
        $origin =array_key_exists("HTTP_ORIGIN", $_SERVER)? $this->origin = $_SERVER["HTTP_ORIGIN"]: NULL;

        $path = parse_url(url: $_SERVER['REQUEST_URI'], component: PHP_URL_PATH);
        $method = $_SERVER['REQUEST_METHOD'];
        $query_params = $_GET;

        $json = file_get_contents('php://input');
        $body = json_decode($json, associative:true);

        $headers = getallheaders();

        $cookies = $_COOKIE;

        return new Request($origin, $path, $method, $query_params, $body, $headers, $cookies);
    }

    public function __construct($origin, $path, $method, $query_params, $body, $headers, $cookies) {
        $this->origin = $origin;
        $this->path = $path;
        $this->method = $method;
        $this->query_params = $query_params;
        $this->body = $body;
        $this->headers = $headers;
        $this->cookies = $cookies;

        # these are set by the base-router or middleware
        $this->user_id = null;
        $this->user_role = null;
        $this->path_params = [];
    }

    function getUserIdOrRaise(){
        if ($this->user_id === NULL){
            throw new \ForbiddenException("forbidden");
        }

        return $this->user_id;
    }

    function validateAdminAccess(){
        if ($this->user_role != "ADMIN") {
            throw new \ForbiddenException("forbidden");
        }
    }

    function validatePathUserIsAuthorized(
        $allowAdminAcces = TRUE
    ){
        if ($allowAdminAcces and $this->user_role == "ADMIN"){
            return;
        }

        if ($this->user_id != $this->path_params["user_id"]) {
            throw new \ForbiddenException("forbidden");
        }
    }

    function validateAcceptableValues($acceptable_values_map){
        $errors = [];
        foreach($this->body as $key => $value){
            if (!array_key_exists($key, $acceptable_values_map)) {
                continue;
            }

            $acceptable_values = $acceptable_values_map[$key];
            if (!in_array($value, $acceptable_values)) {
                $errors[] = "$key must be one of ".join(', ', $acceptable_values);
            }
        }
        if (!empty($errors)){
            throw new \UnprocessableEntityException(join('; ', $errors));
        }
    }

    function validateTypes($acceptable_type_map){
        $errors = [];
        foreach($this->body as $key => $value){
            if (!array_key_exists($key, $acceptable_type_map)) continue;

            $acceptable_type = $acceptable_type_map[$key];
            if (gettype($value) != $acceptable_type) {
                $errors[] = "$key must be a $acceptable_type";
            }
        }
        if (!empty($errors)){
            throw new \UnprocessableEntityException(join('; ', $errors));
        }
    }


    function validateBodyContainsKeys(
        $expected_params, $validateNotNull = FALSE,
    ){
        if (is_null($this->body)) throw new \BadRequestException("no body in request"); 

        $missing_parameters = [];
        $nullParameters = [];
        foreach($expected_params as $param){
            if (!key_exists($param, $this->body)){
                $missing_parameters[] = $param;
            }
            elseif ($validateNotNull and is_null($this->body[$param])) {
                $nullParameters[] = $param;
            }
        }

        $errors = [];
        if (sizeof($missing_parameters) > 0){
            $errors[] = "missing: " . join(', ', $missing_parameters);
        }
        if (sizeof($nullParameters) > 0){
            $errors[] = "cannot be null: " . join(', ', $nullParameters);
        }
        if (!empty($errors)){
            throw new \UnprocessableEntityException(join('; ', $errors));
        }
    }
}
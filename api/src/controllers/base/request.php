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

    public function __construct() {
        $this->origin =array_key_exists("HTTP_ORIGIN", $_SERVER)? $this->origin = $_SERVER["HTTP_ORIGIN"]: NULL;

        $this->path = parse_url(url: $_SERVER['REQUEST_URI'], component: PHP_URL_PATH);
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->query_params = $_GET;

        $json = file_get_contents('php://input');
        $this->body = json_decode($json, associative:true);

        $this->headers = getallheaders();

        $this->cookies = $_COOKIE;

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

    function validateBodyContainsKeys(
        $expected_params, $validateNotNull = FALSE,
    ){
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
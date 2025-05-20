<?php

define("GET", "GET");
define("POST", "POST");

class Request {
    public $path;
    public $params;
    public $method;
    public $body;
    public $headers;
    public $cookies;
    public $user_id;

    public function __construct() {
        $this->path = parse_url(url: $_SERVER['REQUEST_URI'], component: PHP_URL_PATH);
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->params = $_GET;

        $json = file_get_contents('php://input');
        $this->body = json_decode($json, associative:true);

        $this->headers = getallheaders();

        $this->cookies = $_COOKIE;

        $this->user_id = null;
    }
}
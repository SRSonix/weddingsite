<?php

const POST = "POST";
const GET = "GET";

class Request {
    public $origin;
    public $path;
    public $params;
    public $method;
    public $body;
    public $headers;
    public $cookies;
    public $user_id;
    public $user_role;

    public function __construct() {
        $this->origin = $_SERVER["HTTP_ORIGIN"];
        $this->path = parse_url(url: $_SERVER['REQUEST_URI'], component: PHP_URL_PATH);
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->params = $_GET;

        $json = file_get_contents('php://input');
        $this->body = json_decode($json, associative:true);

        $this->headers = getallheaders();

        $this->cookies = $_COOKIE;

        $this->user_id = null;
        $this->user_role = null;
    }
}
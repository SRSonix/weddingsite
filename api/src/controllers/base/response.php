<?php

class Response
{
    public int $status;
    public mixed $body;
    public string $contentType;
    public array $cookies;
    public array $headers;

    public function __construct(
        int $status = 200,
        string $contentType = 'application/json',
        mixed $body = null,
        array $cookies = [],
        array $headers = []
    ) {
        $this->status = $status;
        $this->contentType = $contentType;
        $this->body = $body;
        $this->cookies = $cookies;
        $this->headers = $headers;
    }

    public function handle(){
        http_response_code($this->status);
        header('Content-Type: '.$this->contentType);

        if ($this->contentType == 'application/json') {
            header('Cache-Control: no-store');
        }

        foreach ($this->headers as $name => $value){
            header("$name: $value");
        }

        foreach ($this->cookies as $cookie){
            setcookie(...$cookie);
        }

        if ($this->status === 304) return;

        if ($this->contentType == 'application/json') echo json_encode(value: $this->body);
        else echo $this->body;
    }
}
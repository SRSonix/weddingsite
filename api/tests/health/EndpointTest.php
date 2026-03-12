<?php
require 'app.php';

use PHPUnit\Framework\TestCase;

class EndpointTest extends TestCase
{
    protected function setUp(): void
    {
        // Reset superglobals before each test
        $_SERVER = [];
        $_GET = [];
        $_COOKIE = [];
    }

    public function testHeathReturns200(): void
    {
        # GIVEN
        $_SERVER['REQUEST_URI'] = '/health';
        $_SERVER['REQUEST_METHOD'] = 'GET';

        #WHEN
        $response = app();

        #THEN
        $this->assertEquals($response->status, 200);
        $this->assertEquals($response->body, ["status"=>"up"]);
        $this->assertEquals($response->contentType, 'application/json');
    }
}

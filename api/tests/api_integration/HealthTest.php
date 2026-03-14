<?php
require_once 'app.php';
require_once "BaseTestCases.php";

use PHPUnit\Framework\TestCase;

class HealthTest extends ApiIntegrationTestCase
{
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

    public function testBogusPathReturns404(): void
    {
        # GIVEN
        $_SERVER['REQUEST_URI'] = '/bogus';
        $_SERVER['REQUEST_METHOD'] = 'GET';

        #WHEN
        $response = app();

        #THEN
        $this->assertEquals($response->status, 404);
    }

    public function testWrongMetodReturns404(): void
    {
        # GIVEN
        $_SERVER['REQUEST_URI'] = '/health';
        $_SERVER['REQUEST_METHOD'] = 'POST';

        #WHEN
        $response = app();

        #THEN
        $this->assertEquals($response->status, 404);
    }
}

<?php
require_once 'app.php';
require_once "BaseTestCases.php";

use PHPUnit\Framework\TestCase;

class HealthTest extends ApiIntegrationTestCase
{
    public function testHeathReturns200(): void
    {
        # GIVEN
        $request = parent::createRequest(path:"/health", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals($response->status, 200);
        $this->assertEquals($response->body, ["status"=>"up"]);
        $this->assertEquals($response->contentType, 'application/json');
    }

    public function testBogusPathReturns404(): void
    {
        # GIVEN
        $request = parent::createRequest(path:"/bogus", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals($response->status, 404);
    }

    public function testWrongMetodReturns404(): void
    {
        # GIVEN
        $request = parent::createRequest(path:"/bogus", method:POST);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals($response->status, 404);
    }
}

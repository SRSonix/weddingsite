<?php
require_once 'app.php';
require_once "BaseTestCases.php";

use PHPUnit\Framework\TestCase;

class AuthTest extends ApiIntegrationTestCase
{
    public function testLoginWithoutTokenReturns401(): void
    {
        # GIVEN
        $request = parent::createRequest(path:"/auth/login", method:POST);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(401, $response->status);
    }

    public function testLoginWithUserTokenSetsSessionToken(): void
    {
        # GIVEN
        $request = parent::createRequest(path:"/auth/login", method:POST, body: ["token"=>parent::USER_TOKEN]);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals($response->status, 200);
        $this->assertCount(1, $response->cookies);
        $this->assertCount(3, $response->cookies[0]);
        $this->assertEquals("session_token", $response->cookies[0][0]);
        $this->assertIsString($response->cookies[0][1]);
        $this->assertGreaterThan(time(), $response->cookies[0][2]["expires"]);
    }

    public function testLoginWithAdminTokenSetsSessionToken(): void
    {
        # GIVEN
        $request = parent::createRequest(path:"/auth/login", method:POST, body: ["token"=>parent::ADMIN_TOKEN]);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals($response->status, 200);
        $this->assertCount(1, $response->cookies);
        $this->assertCount(3, $response->cookies[0]);
        $this->assertEquals("session_token", $response->cookies[0][0]);
        $this->assertIsString($response->cookies[0][1]);
        $this->assertGreaterThan(time(), $response->cookies[0][2]["expires"]);
    }


    public function testLogoutWithTokenUnsetsSessionToken(): void
    {   
        # GIVEN
        $request = parent::createRequest(path:"/auth/logout", method:POST, body: ["token"=>parent::ADMIN_TOKEN]);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals($response->status, 200);
        $this->assertCount(1, $response->cookies);
        $this->assertCount(3, $response->cookies[0]);
        $this->assertEquals("session_token", $response->cookies[0][0]);
        $this->assertEquals("", $response->cookies[0][1]);
        $this->assertLessThan(time(), $response->cookies[0][2]["expires"]);
    }

    public function testLogoutWithoutTokenUnsetsSessionToken(): void
    {   
        # GIVEN
        $request = parent::createRequest(path:"/auth/logout", method:POST);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals($response->status, 200);
        $this->assertCount(1, $response->cookies);
        $this->assertCount(3, $response->cookies[0]);
        $this->assertEquals("session_token", $response->cookies[0][0]);
        $this->assertEquals("", $response->cookies[0][1]);
        $this->assertLessThan(time(), $response->cookies[0][2]["expires"]);
    }
}

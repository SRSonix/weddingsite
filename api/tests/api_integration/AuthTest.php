<?php
require_once 'app.php';
require_once "BaseTestCases.php";

use PHPUnit\Framework\TestCase;

class AuthTest extends ApiIntegrationTestCase
{
    public function testLoginWithoutTokenReturns401(): void
    {
        # GIVEN
        $_SERVER['REQUEST_URI'] = '/auth/login';
        $_SERVER['REQUEST_METHOD'] = 'POST';

        #WHEN
        $response = app();

        #THEN
        $this->assertEquals(401, $response->status);
    }

    public function testLoginWithTokenSetsSessionToken(): void
    {
        # GIVEN
        $_SERVER['REQUEST_URI'] = '/auth/login';
        $_SERVER['REQUEST_METHOD'] = 'POST';

        #WHEN
        $response = app([
            "body"=>["token"=>parent::ADMIN_TOKEN]
        ]);

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
        $_SERVER['REQUEST_URI'] = '/auth/logout';
        $_SERVER['REQUEST_METHOD'] = 'POST';

        #WHEN
        $response = app([
            "body"=>["token"=>parent::ADMIN_TOKEN]
        ]);

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
        $_SERVER['REQUEST_URI'] = '/auth/logout';
        $_SERVER['REQUEST_METHOD'] = 'POST';

        #WHEN
        $response = app();

        #THEN
        $this->assertEquals($response->status, 200);
        $this->assertCount(1, $response->cookies);
        $this->assertCount(3, $response->cookies[0]);
        $this->assertEquals("session_token", $response->cookies[0][0]);
        $this->assertEquals("", $response->cookies[0][1]);
        $this->assertLessThan(time(), $response->cookies[0][2]["expires"]);
    }
}

<?php
require_once 'repositories/helper.php';
require_once 'controllers/base/request.php';

use PHPUnit\Framework\TestCase;

class DatabaseTestCase extends TestCase
{   
    const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImp0aSI6ImNhNmIxZmIxYTdlMGU0ODUyM2MxODc1ZWFiN2ExMzBhNDc5NDJiMDUifQ.fURoQcomILheKE_kKvA_q2jK4NlCfzBmhPlmFcewohg";
    const USER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImp0aSI6ImI0ODAxYWZhYmQyZWUxMWE0MTFiMWMxYWQ5ZGU4MDU4ZTgzNTY1MGIifQ.JbWqrmkKc_LySgp2pDuUgJbxtov_tqj8twm98nMfb1I";

    protected function setUp(): void{
        $sql = <<<SQL
            CREATE TABLE user (
            id INT NOT NULL PRIMARY KEY,
            role ENUM('USER', 'ADMIN') NOT NULL,
            name TEXT,
            mail TEXT,
            attendance ENUM('will_join', 'will_not_join', 'undecided'),
            language ENUM('fr', 'de'),
            last_visit TIMESTAMP,
            seating_preference TEXT,
            invited_by ENUM('groom', 'bride', 'both') NOT NULL
            );

            CREATE TABLE user_auth (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            jti VARCHAR(64)
            );

            CREATE TABLE family_member (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            name TEXT,
            diet TEXT,
            type ENUM('adult', 'child', 'infant') NOT NULL,
            FOREIGN KEY (user_id) REFERENCES user(id)
            );

            INSERT INTO user_auth(id, jti) VALUES
                (1, 'ca6b1fb1a7e0e48523c1875eab7a130a47942b05'),
                (2, 'b4801afabd2ee11a411b1c1ad9de8058e835650b')
            ;
            INSERT INTO user (id, role, name, invited_by) VALUES 
                (1, 'ADMIN', 'ADMIN', 'both'),
                (2, 'USER', 'USER', 'both')
            ;
        SQL;

        $session = create_db_session();
        $stmt = $session->exec($sql);
        $session = NULL;
    }

    protected function tearDown(): void{
        $sql = <<<SQL
            DROP TABLE family_member;
            DROP TABLE user_auth;
            DROP TABLE user;
        SQL;

        $session = create_db_session();
        $stmt = $session->exec($sql);
        $session = NULL;
    }
}

class ApiIntegrationTestCase extends DatabaseTestCase
{   
    protected ?string $session_token = NULL;
    
    protected function setUp(): void{
        parent::setUp();
    }

    protected function tearDown(): void{
        parent::tearDown();
        $this->session_token = NULL;
    }

    protected function createRequest(
        $path, 
        $method, 
        $origin = NULL, 
        $query_params = [], 
        $body = NULL, 
        $headers = [], 
        $cookies = []
    ): Request{
        if (!is_null($this->sessionToken)){
            $cookies["session_token"] = $this->sessionToken;
        }

        return new Request($origin, $path, $method, $query_params, $body, $headers, $cookies);
    }

    protected function logout(){
        $request = $this->createRequest(path:"/auth/logout", method:POST);
        $response = app($request);

        $this->assertEquals($response->status, 200);
        $this->sessionToken = NULL;
    }

    protected function loginAsUser(){
        $request = $this->createRequest(path:"/auth/login", method:POST, body: ["token"=>parent::USER_TOKEN]);
        $response = app($request);

        $this->assertEquals($response->status, 200);
        $this->sessionToken = $response->cookies[0][1];
    }


    protected function loginAsAdmin(){
        $request = $this->createRequest(path:"/auth/login", method:POST, body: ["token"=>parent::ADMIN_TOKEN]);
        $response = app($request);

        $this->assertEquals($response->status, 200);
        $this->sessionToken = $response->cookies[0][1];
    }
}
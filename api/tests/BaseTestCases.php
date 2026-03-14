<?php
require_once 'repositories/helper.php';

use PHPUnit\Framework\TestCase;

class DatabaseTestCase extends TestCase
{   
    const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImp0aSI6ImNhNmIxZmIxYTdlMGU0ODUyM2MxODc1ZWFiN2ExMzBhNDc5NDJiMDUifQ.fURoQcomILheKE_kKvA_q2jK4NlCfzBmhPlmFcewohg";

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
            seating_preference TEXT
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
            child BOOLEAN,
            FOREIGN KEY (user_id) REFERENCES user(id)
            );

            INSERT INTO user_auth(id, jti) VALUES(
                1, 'ca6b1fb1a7e0e48523c1875eab7a130a47942b05'
            );
            INSERT INTO user (id, role, name) VALUES (
                1, 'ADMIN', 'ADMIN'
            );
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
    protected function setUp(): void{
        parent::setUp();

        $_SERVER = [];
        $_GET = [];
        $_COOKIE = [];
    }

    protected function tearDown(): void{
        parent::tearDown();
    }
}
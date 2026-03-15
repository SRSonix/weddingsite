<?php
require_once 'app.php';
require_once "BaseTestCases.php";

use PHPUnit\Framework\TestCase;

class UserTest extends ApiIntegrationTestCase
{
    public function testCreateUserNoCredentialsReturns403(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user", method:POST);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

    public function testCreateUserAdminCredentialsNoBodyReturns400(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user", method:POST);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(400, $response->status);
    }

    public static function userPartialBodies(): array
    {
        return [
            [["role"=> "USER", "language"=> "fr"]],
            [["name" => "test-user","language"=> "fr"]],
            [["name" => "test-user", "role"=> "USER",]],
            [["name" => NULL, "role"=> "USER", "language"=> "fr"]],
            [["name" => "test-user", "role"=> NULL, "language"=> "fr"]],
            [["name" => "test-user", "role"=> "USER", "language"=> NULL]]
        ];
    }

    /**
     * @dataProvider userPartialBodies
     */
    public function testCreateUserAdminCredentialsPartialBodyReturns422($body): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user", method:POST, body:$body);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(422, $response->status);
    }

    public function testCreateUserAdminCredentialsCreatesUser(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user", method:POST, body:["name" => "test-user", "role"=> "USER", "language"=> "fr"]);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(201, $response->status);
        $this->assertIsString($response->body["token"]);
        $request = $this->createRequest(path:"/users", method:GET);
        $response = app($request);
        $this->assertEquals(3, count($response->body["data"]));
    }

    public function testCreateUserUserCredentialsReturns403(): void
    {
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/user", method:POST);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

    
    public function testGetUserNoCredentialsReturns403(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

    
    public function testGetUserUserCredentialsReturnsUser(): void
    {
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/user", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertInstanceOf(User::class, $response->body);
    }

    public function testGetUserAdminCredentialsReturnsUser(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertInstanceOf(User::class, $response->body);
    }


    public function testGetAllUsersNoCredentialsReturns403(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/users", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

    
    public function testGetAllUsersUserCredentialsReturns403(): void
    {
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/users", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

    public function testGetAllUsersAdminredentialsReturnsUsers(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/users", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertEquals(2, count($response->body["data"]));
        foreach($response->body["data"] as $entry){
            $this->assertInstanceOf(User::class, $entry);
        }
    }


    public function testUpdateUserRsvpNoCredentialsReturns403(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user/1/rsvp", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

        
    public function testUpdateUserRsvpUserCredentialsOtherUserReturns403(): void
    {
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/user/1/rsvp", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

    
    public static function validUpdateRsvpSetups(): array
    {
        return [
            ["user", "user", 2],
            ["admin","admin", 1],
            ["admin","user", 2],
        ];
    }

    /**
     * @dataProvider validUpdateRsvpSetups
     */
    public function testUpdateUserRsvpReturnUpdates($login_user, $target_user, $target_user_id): void
    {
        # GIVEN
        if ($login_user == "user") parent::loginAsUser();
        else parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/$target_user_id/rsvp", method:PUT, body:["mail"=>"test.mail", "attendance"=>"WILL_JOIN", "language"=>"de"]);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertInstanceOf(User::class, $response->body);
        if ($target_user == "user") parent::loginAsUser();
        else parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user", method:GET);
        $response = app($request);
        $this->assertInstanceOf(User::class, $response->body);
        $this->assertEquals("test.mail", $response->body->mail);
        $this->assertEquals("will_join", $response->body->attendance);
        $this->assertEquals("de", $response->body->language);
    }

    public function testUpdateUserRsvpNoBodyReturns400(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/1/rsvp", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(400, $response->status);
    }


    public static function userUpdateRsvpPartialBodies(): array
    {
        return [
            [["attendance"=>"WILL_JOIN", "language"=>"de"]],
            [["mail"=>"test.mail", "language"=>"de"]],
            [["mail"=>"test.mail", "attendance"=>"WILL_JOIN"]],
            [["mail"=>NULL, "attendance"=>"WILL_JOIN", "language"=>"de"]],
            [["mail"=>"test.mail", "attendance"=>NULL, "language"=>"de"]],
            [["mail"=>"test.mail", "attendance"=>"WILL_JOIN", "language"=>NULL]],
        ];
    }

    /**
     * @dataProvider userUpdateRsvpPartialBodies
     */
    public function testUpdateUserRsvpPartialBodyReturns422($body): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/1/rsvp", method:PUT, body:$body);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(422, $response->status);
    }

    
    public function testUpdateUserCoreNoCredentialsReturns403(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user/1/core-info", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

        
    public function testUpdateUserCoreUserCredentialReturns403(): void
    {
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/user/2/core-info", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

    
    public static function validUpdateCoreSetups(): array
    {
        return [
            ["admin","admin", 1],
            ["admin","user", 2],
        ];
    }

    /**
     * @dataProvider validUpdateCoreSetups
     */
    public function testUpdateUserCoreReturnUpdates($login_user, $target_user, $target_user_id): void
    {
        # GIVEN
        if ($login_user == "user") parent::loginAsUser();
        else parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/$target_user_id/core-info", method:PUT, body:["name"=>"bogus", "role"=>"ADMIN"]);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertInstanceOf(User::class, $response->body);
        if ($target_user == "user") parent::loginAsUser();
        else parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user", method:GET);
        $response = app($request);
        $this->assertInstanceOf(User::class, $response->body);
        $this->assertEquals("bogus", $response->body->name);
        $this->assertEquals("ADMIN", $response->body->role);
    }

    public function testUpdateUserCoreNoBodyReturns400(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/2/core-info", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(400, $response->status);
    }


    public static function userUpdateCorePartialBodies(): array
    {
        return [
            [["role"=>"ADMIN"]],
            [["name"=>"bogus"]],
            [["name"=>NULL, "role"=>"ADMIN"]],
            [["name"=>"bogus", "role"=>NULL]],
        ];
    }

    /**
     * @dataProvider userUpdateCorePartialBodies
     */
    public function testUpdateUserCorePartialBodyReturns422($body): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/2/core-info", method:PUT, body:$body);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(422, $response->status);
    }


    public function testUpdateUserTokenNoCredentialsReturns403(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user/1/reset-token", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

        
    public function testUpdateUserTokenUserCredentialOtherUserReturns403(): void
    {
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/user/1/reset-token", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

    
    public static function validUpdateTokenSetups(): array
    {
        return [
            ["user","user", 2],
            ["admin","admin", 1],
            ["admin","user", 2],
        ];
    }

    /**
     * @dataProvider validUpdateTokenSetups
     */
    public function testUpdateUserTokenReturnUpdates($login_user, $target_user, $target_user_id): void
    {
        # GIVEN
        if ($login_user == "user") parent::loginAsUser();
        else parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/$target_user_id/reset-token", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $request = $this->createRequest(path:"/auth/login", method:POST, body:["token"=>$response->body["token"]]);
        $response = app($request);
        $this->assertEquals(200, $response->status);
    }


    public function testDeleteUserNoCredentialsReturns403(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user/1", method:DELETE);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

        
    public function testDeleteUserUserCredentialReturns403(): void
    {
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/user/2", method:DELETE);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

    
    public function testDeleteUserAdminDeletesUser(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/2", method:DELETE);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertEquals("true", $response->body["success"]);
        $request = $this->createRequest(path:"/users", method:GET);
        $response = app($request);
        $this->assertEquals(1, count($response->body["data"]));
    }


    public function testDeleteUserAdminCannotDeleteSelf(): void
    {
        # GIVEN
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/1", method:DELETE);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
        $this->assertEquals("you are not allowed to delete yourself. ask another admin!", $response->body["message"]);
    }
}


# TODO: test some endpoints for invalid tokens: language / role etc.
# TODO: should admin be able to remove himself?
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
        $this->assertEquals(204, $response->status);
        $this->assertEquals(NULL, $response->body);
        $request = $this->createRequest(path:"/users", method:GET);
        $response = app($request);
        $this->assertEquals(1, count($response->body["data"]));
    }

    public function testDeleteUserAdminDeletesNonExistingUserReturns404(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/3", method:DELETE);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(404, $response->status);
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

    public function testAddFamilymemberNoCredentialsReturns403(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user/1/family-member", method:POST);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

        
    public function testAddFamilymemberUserCredentialsOtherUserReturns403(): void
    {
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/user/1/family-member", method:POST);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

    
    public static function validFamilyMemberSetups(): array
    {
        return [
            ["user", "user", 2],
            ["admin","admin", 1],
            ["admin","user", 2],
        ];
    }

    /**
     * @dataProvider validFamilyMemberSetups
     */
    public function testAddFamilymemberAdds($login_user, $target_user, $target_user_id): void
    {
        # GIVEN
        if ($login_user == "user") parent::loginAsUser();
        else parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/$target_user_id/family-member", method:POST, body:["name"=>"test-name", "diet"=>"vegan", "is_child"=>True]);
        $response = app($request);   
        $this->assertEquals(201, $response->status);
        
        #WHEN     
        $request = $this->createRequest(path:"/user/$target_user_id/family-member", method:POST, body:["name"=>"test-name2", "diet"=>NULL, "is_child"=>False]);
        $response = app($request);

        #THEN
        $this->assertEquals(201, $response->status);
        $this->assertInstanceOf(FamilyMember::class, $response->body);
        if ($target_user == "user") parent::loginAsUser();
        else parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user", method:GET);
        $response = app($request);
        $this->assertInstanceOf(User::class, $response->body);
        $this->assertCount(2, $response->body->family_members);
        $this->assertEquals("test-name", $response->body->family_members[0]->name);
        $this->assertEquals("vegan", $response->body->family_members[0]->diet); 
        $this->assertEquals(True, $response->body->family_members[0]->is_child);
        $this->assertEquals("test-name2", $response->body->family_members[1]->name);
        $this->assertEquals(NULL, $response->body->family_members[1]->diet); 
        $this->assertEquals(False, $response->body->family_members[1]->is_child);   
    }

    public function testAddFamilymemberNoBodyReturns400(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/1/family-member", method:POST);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(400, $response->status);
    }


    public static function familyMembersPartialBodies(): array
    {
        return [
            [["diet"=>"vegan", "is_child"=>True]],
            [["name"=>"test-name", "is_child"=>True]],
            [["name"=>"test-name", "diet"=>"vegan"]],
            [["name"=>NULL, "diet"=>"vegan", "is_child"=>NULL]],
        ];
    }

    /**
     * @dataProvider familyMembersPartialBodies
     */
    public function testAddFamilymemberPartialBodyReturns422($body): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/1/family-member", method:POST, body:$body);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(422, $response->status);
    }

    public function testUpdateFamilymemberNoCredentialsReturns403(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user/1/family-member/1", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

        
    public function testUpdateFamilymemberUserCredentialsOtherUserReturns403(): void
    {
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/user/1/family-member/1", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

    public function testUpdateNonExistingFamilymemberReturns404(): void
    {
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/user/2/family-member/1", method:PUT, body:["name"=>"test-name", "diet"=>"vegan", "is_child"=>True]);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(404, $response->status);
    }


    /**
     * @dataProvider validFamilyMemberSetups
     */
    public function testUpdateFamilymemberReturnUpdates($login_user, $target_user, $target_user_id): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/$target_user_id/family-member", method:POST, body:["name"=>"test-name", "diet"=>"vegan", "is_child"=>True]);
        $response = app($request);
        $this->assertEquals(201, $response->status);
        
        if ($login_user == "user") parent::loginAsUser();
        else parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/$target_user_id/family-member/1", method:PUT, body:["name"=>"test-name2", "diet"=>"meat", "is_child"=>False]);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertInstanceOf(FamilyMember::class, $response->body);
        if ($target_user == "user") parent::loginAsUser();
        else parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user", method:GET);
        $response = app($request);
        $this->assertInstanceOf(User::class, $response->body);
        $this->assertEquals("test-name2", $response->body->family_members[0]->name);
        $this->assertEquals("meat", $response->body->family_members[0]->diet); 
        $this->assertEquals(False, $response->body->family_members[0]->is_child);  
    }

    public function testUpdateFamilymemberNoBodyReturns400(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/1/rsvp", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(400, $response->status);
    }

    /**
     * @dataProvider familyMembersPartialBodies
     */
    public function testUpdateFamilymemberPartialBodyReturns422($body): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/1/family-member", method:POST, body:["name"=>"test-name", "diet"=>"vegan", "is_child"=>True]);
        $response = app($request);
        $this->assertEquals(201, $response->status);
        
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/1/family-member/1", method:PUT, body:$body);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(422, $response->status);
    }


    
    public function testDeleteFamilymemberNoCredentialsReturns403(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user/1/rsvp", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

        
    public function testDeleteFamilymemberUserCredentialsOtherUserReturns403(): void
    {
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/user/1/rsvp", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

    public function testDeleteNonExistingFamilymemberReturns404(): void
    {
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/user/2/family-member/1", method:DELETE);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(404, $response->status);
    }

    /**
     * @dataProvider validFamilyMemberSetups
     */
    public function testDeleteFamilymemberDeletes($login_user, $target_user, $target_user_id): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/$target_user_id/family-member", method:POST, body:["name"=>"test-name", "diet"=>"vegan", "is_child"=>True]);
        $response = app($request);
        $this->assertEquals(201, $response->status);

        if ($login_user == "user") parent::loginAsUser();
        else parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/$target_user_id/family-member/1", method:DELETE);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(204, $response->status);
        $this->assertEquals(NULL, $response->body);
        if ($target_user == "user") parent::loginAsUser();
        else parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user", method:GET);
        $response = app($request);
        $this->assertCount(0, $response->body->family_members);
    }

}

# TODO: test some endpoints for invalid tokens: language / role etc.
# TODO: should admin be able to remove himself?
<?php
require_once 'app.php';
require_once "BaseTestCases.php";

use PHPUnit\Framework\TestCase;

class UserTest extends ApiIntegrationTestCase
{
    public function testCreateUserNoCredentialsReturns401(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user", method:POST);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(401, $response->status);
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

    public static function invalidUsers(): array
    {
        return [
            [["role"=> "USER", "language"=> "fr", "invited_by"=>"both"]],
            [["name" => "test-user","language"=> "fr", "invited_by"=>"both"]],
            [["name" => "test-user", "role"=> "USER", "invited_by"=>"both"]],
            [["name" => "test-user", "role"=> "USER", "language"=> "fr"]],
            [["name" => NULL, "role"=> "USER", "language"=> "fr", "invited_by"=>"both"]],
            [["name" => "test-user", "role"=> NULL, "language"=> "fr", "invited_by"=>"both"]],
            [["name" => "test-user", "role"=> "USER", "language"=> NULL, "invited_by"=>"both"]],
            [["name" => "test-user", "role"=> "USER", "language"=> "fr", "invited_by"=> NULL]],
            [["name" => "test-user", "role"=> "bogus", "language"=> "fr", "invited_by"=>"both"]],
            [["name" => "test-user", "role"=> "USER", "language"=> "bogus", "invited_by"=>"both"]],
            [["name" => "test-user", "role"=> "USER", "language"=> "fr", "invited_by"=> "bogus"]],
        ];
    }

    /**
     * @dataProvider invalidUsers
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


    public static function validUsers(): array
    {
        return [
            [["name" => "test-user", "role"=> "USER", "language"=> "fr", "invited_by"=> "groom"]],
            [["name" => "test-user1", "role"=> "USER", "language"=> "de", "invited_by"=> "bride"]],
            [["name" => "test-user2", "role"=> "ADMIN", "language"=> "de", "invited_by"=> "both"]],
            [["name" => "test-user3", "role"=> "USER", "language"=> "en", "invited_by"=> "groom"]],
        ];
    }

    /**
     * @dataProvider validUsers
     */
    public function testCreateUserAdminCredentialsCreatesUser($body): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user", method:POST, body:$body);

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


    public function testGetUserNoCredentialsReturns401(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(401, $response->status);
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


    public function testGetAllUsersNoCredentialsReturns401(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/users", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(401, $response->status);
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


    # --- contact endpoint (mail + language, self or admin) ---

    public function testUpdateUserContactNoCredentialsReturns401(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user/1/contact", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(401, $response->status);
    }

    public function testUpdateUserContactUserCredentialsOtherUserReturns403(): void
    {
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/user/1/contact", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

    public static function validUpdateContacts(): array
    {
        return [
            [["mail"=>"test.mail",  "language"=>"fr"]],
            [["mail"=>"",           "language"=>"fr"]],
            [["mail"=>NULL,         "language"=>"fr"]],
            [["mail"=>"test.mail1", "language"=>"de"]],
            [["mail"=>"test.mail2", "language"=>"en"]],
        ];
    }

    /**
     * @dataProvider validUpdateContacts
     */
    public function testUpdateUserContactReturnUpdatesForAllValidBodies($body): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/1/contact", method:PUT, body:$body);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
    }

    public static function validUpdateContactSetups(): array
    {
        return [
            ["user", "user", 2],
            ["admin", "admin", 1],
            ["admin", "user", 2],
        ];
    }

    /**
     * @dataProvider validUpdateContactSetups
     */
    public function testUpdateUserContactReturnUpdates($login_user, $target_user, $target_user_id): void
    {
        # GIVEN
        if ($login_user == "user") parent::loginAsUser();
        else parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/$target_user_id/contact", method:PUT, body:["mail"=>"test.mail", "language"=>"de"]);

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
        $this->assertEquals("de", $response->body->language);
    }

    public function testUpdateUserContactNoBodyReturns400(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/1/contact", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(400, $response->status);
    }

    public static function userUpdateContactPartialBodies(): array
    {
        return [
            [["language"=>"de"]],
            [["mail"=>"test.mail"]],
            [["mail"=>"test.mail", "language"=>NULL]],
            [["mail"=>"test.mail", "language"=>"bogus"]],
        ];
    }

    /**
     * @dataProvider userUpdateContactPartialBodies
     */
    public function testUpdateUserContactPartialBodyReturns422($body): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/1/contact", method:PUT, body:$body);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(422, $response->status);
    }


    # --- admin update endpoint (all fields, admin only) ---

    public function testUpdateUserNoCredentialsReturns401(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user/1", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(401, $response->status);
    }

    public function testUpdateUserUserCredentialReturns403(): void
    {
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/user/2", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

    public function testUpdateUserAdminCannotUpdateSelf(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/1", method:PUT, body:["name"=>"bogus", "role"=>"USER", "invited_by"=>"both", "mail"=>NULL, "language"=>"de"]);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
        $this->assertEquals("admins cannot perform this action on their own account. ask another admin!", $response->body["message"]);
    }

    public static function validUpdateUserBodies(): array
    {
        return [
            [["name"=>"user",  "role"=>"ADMIN", "invited_by"=>"groom", "mail"=>"a@b.com", "language"=>"fr"]],
            [["name"=>"user2", "role"=>"USER",  "invited_by"=>"bride", "mail"=>NULL,       "language"=>"de"]],
            [["name"=>"user3", "role"=>"USER",  "invited_by"=>"both",  "mail"=>"",         "language"=>"de"]],
            [["name"=>"user4", "role"=>"USER",  "invited_by"=>"groom", "mail"=>"c@d.com",  "language"=>"en"]],
        ];
    }

    /**
     * @dataProvider validUpdateUserBodies
     */
    public function testUpdateUserReturnUpdatesForAllValidBodies($body): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/2", method:PUT, body:$body);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
    }

    public function testUpdateUserReturnUpdates(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/2", method:PUT, body:["name"=>"bogus", "role"=>"ADMIN", "invited_by"=>"both", "mail"=>"test@test.com", "language"=>"fr"]);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertInstanceOf(User::class, $response->body);
        parent::loginAsUser();
        $request = $this->createRequest(path:"/user", method:GET);
        $response = app($request);
        $this->assertInstanceOf(User::class, $response->body);
        $this->assertEquals("bogus", $response->body->name);
        $this->assertEquals("ADMIN", $response->body->role);
        $this->assertEquals("test@test.com", $response->body->mail);
        $this->assertEquals("fr", $response->body->language);
    }

    public function testUpdateUserNoBodyReturns400(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/2", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(400, $response->status);
    }

    public static function userUpdatePartialBodies(): array
    {
        return [
            [["role"=>"ADMIN", "invited_by"=>"both", "mail"=>NULL, "language"=>"de"]],
            [["name"=>"user", "invited_by"=>"both", "mail"=>NULL, "language"=>"de"]],
            [["name"=>"user", "role"=>"ADMIN", "mail"=>NULL, "language"=>"de"]],
            [["name"=>"user", "role"=>"ADMIN", "invited_by"=>"both", "language"=>"de"]],
            [["name"=>"user", "role"=>"ADMIN", "invited_by"=>"both", "mail"=>NULL]],
            [["name"=>NULL,    "role"=>"ADMIN", "invited_by"=>"both", "mail"=>NULL, "language"=>"de"]],
            [["name"=>"user", "role"=>NULL,    "invited_by"=>"both", "mail"=>NULL, "language"=>"de"]],
            [["name"=>"user", "role"=>"ADMIN", "invited_by"=>NULL,   "mail"=>NULL, "language"=>"de"]],
            [["name"=>"user", "role"=>"ADMIN", "invited_by"=>"both", "mail"=>NULL, "language"=>NULL]],
            [["name"=>"user", "role"=>"bogus", "invited_by"=>"both", "mail"=>NULL, "language"=>"de"]],
            [["name"=>"user", "role"=>"ADMIN", "invited_by"=>"bogus","mail"=>NULL, "language"=>"de"]],
            [["name"=>"user", "role"=>"ADMIN", "invited_by"=>"both", "mail"=>NULL, "language"=>"bogus"]],
        ];
    }

    /**
     * @dataProvider userUpdatePartialBodies
     */
    public function testUpdateUserPartialBodyReturns422($body): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/2", method:PUT, body:$body);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(422, $response->status);
    }


    # --- reset token ---

    public function testUpdateUserTokenNoCredentialsReturns401(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user/1/reset-token", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(401, $response->status);
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


    # --- delete user ---

    public function testDeleteUserNoCredentialsReturns401(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user/1", method:DELETE);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(401, $response->status);
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

    public function testDeleteUserWithFamilyMembersDeletes(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/2/family-member", method:POST, body:["name"=>"family-name", "diet"=>NULL, "type"=>"adult"]);
        $response = app($request);
        $this->assertEquals(201, $response->status);

        $request = $this->createRequest(path:"/user/2", method:DELETE);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(204, $response->status);
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
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/1", method:DELETE);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
        $this->assertEquals("admins cannot perform this action on their own account. ask another admin!", $response->body["message"]);
    }


    # --- last visit ---

    public function testGetUserUpdatesLastVisit(): void
    {
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/user", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertNotNull($response->body->last_visit);
    }

    private function getLastVisit(int $user_id): ?string {
        $session = create_db_session();
        $stmt = $session->prepare("SELECT last_visit FROM user WHERE id = :id;");
        $stmt->execute(["id" => $user_id]);
        return $stmt->fetch()["last_visit"];
    }

    public static function endpointsNotAffectingLastVisit(): array {
        return [
            ["/users",                    GET,    NULL,                                                                                false],
            ["/user/2/contact",           PUT,    ["mail"=>"m", "language"=>"de"],                                                     false],
            ["/user/2",                   PUT,    ["name"=>"n", "role"=>"USER", "invited_by"=>"both", "mail"=>NULL, "language"=>"de"], false],
            ["/user/2/reset-token",       PUT,    NULL,                                                                                false],
            ["/user/2/family-member",     POST,   ["name"=>"n", "diet"=>NULL, "type"=>"adult"],                                        false],
            ["/user/2/family-member/1",   PUT,    ["name"=>"n", "diet"=>NULL, "type"=>"adult", "attendance"=>"will_join", "brunch_attendance"=>"will_join"], true],
        ];
    }

    /**
     * @dataProvider endpointsNotAffectingLastVisit
     */
    public function testEndpointDoesNotUpdateLastVisit(string $path, string $method, ?array $body, bool $needs_family_member): void
    {
        # GIVEN
        parent::loginAsAdmin();

        if ($needs_family_member) {
            $setup = $this->createRequest(path:"/user/2/family-member", method:POST, body:["name"=>"setup", "diet"=>NULL, "type"=>"adult"]);
            app($setup);
        }

        $request = $this->createRequest(path:$path, method:$method, body:$body);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertGreaterThanOrEqual(200, $response->status);
        $this->assertLessThan(300, $response->status);
        $this->assertNull($this->getLastVisit(2));
    }


    # --- family member add (admin only) ---

    public function testAddFamilymemberNoCredentialsReturns401(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user/1/family-member", method:POST);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(401, $response->status);
    }

    public function testAddFamilymemberUserCredentialsSelfReturns403(): void
    {
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/user/2/family-member", method:POST);

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

    public function testAddFamilymemberAdminCannotAddToSelf(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/1/family-member", method:POST, body:["name"=>"test-name", "diet"=>NULL, "type"=>"adult"]);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
        $this->assertEquals("admins cannot perform this action on their own account. ask another admin!", $response->body["message"]);
    }

    public function testAddFamilymemberAdds(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/2/family-member", method:POST, body:["name"=>"test-name", "diet"=>"vegan", "type"=>"child"]);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(201, $response->status);
        $this->assertInstanceOf(FamilyMember::class, $response->body);
        parent::loginAsUser();
        $request = $this->createRequest(path:"/user", method:GET);
        $response = app($request);
        $this->assertInstanceOf(User::class, $response->body);
        $this->assertCount(1, $response->body->family_members);
        $this->assertEquals("test-name", $response->body->family_members[0]->name);
        $this->assertEquals("vegan", $response->body->family_members[0]->diet);
        $this->assertEquals("child", $response->body->family_members[0]->type);
        $this->assertNull($response->body->family_members[0]->attendance);
    }

    public static function validFamilyMemberBodies(): array
    {
        return [
            [["name"=>"test-name", "diet"=>"vegan", "type"=>"child"]],
            [["name"=>"test-name", "diet"=>NULL,    "type"=>"infant"]],
            [["name"=>"test-name", "diet"=>"",      "type"=>"adult"]],
        ];
    }

    /**
     * @dataProvider validFamilyMemberBodies
     */
    public function testAddFamilymemberValidBodies(array $body): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/2/family-member", method:POST, body:$body);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(201, $response->status);
        $this->assertInstanceOf(FamilyMember::class, $response->body);
        $this->assertEquals($body["name"], $response->body->name);
        $this->assertEquals($body["diet"], $response->body->diet);
        $this->assertEquals($body["type"], $response->body->type);
        $this->assertNull($response->body->attendance);
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

    public static function familyMemberAddPartialBodies(): array
    {
        return [
            [["diet"=>"vegan", "type"=>"adult"]],
            [["name"=>"test-name", "type"=>"adult"]],
            [["name"=>"test-name", "diet"=>"vegan"]],
            [["name"=>NULL, "diet"=>"vegan", "type"=>"adult"]],
            [["name"=>"test-name", "diet"=>"vegan", "type"=>NULL]],
            [["name"=>"test-name", "diet"=>"vegan", "type"=>"bogus"]],
        ];
    }


    /**
     * @dataProvider familyMemberAddPartialBodies
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


    # --- family member update (self or admin, includes attendance) ---

    public function testUpdateFamilymemberNoCredentialsReturns401(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user/1/family-member/1", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(401, $response->status);
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
        $request = $this->createRequest(path:"/user/2/family-member/1", method:PUT, body:["name"=>"test-name", "diet"=>"vegan", "type"=>"child", "attendance"=>"will_join", "brunch_attendance"=>"will_join"]);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(404, $response->status);
    }

    public static function validFamilyMemberUpdateSetups(): array
    {
        return [
            ["user", "user", 2],
            ["admin", "admin", 1],
            ["admin", "user", 2],
        ];
    }

    /**
     * @dataProvider validFamilyMemberUpdateSetups
     */
    public function testUpdateFamilymemberReturnUpdates($login_user, $target_user, $target_user_id): void
    {
        # GIVEN
        # Insert directly via SQL: admins cannot add family members to their own account via the API,
        # so using SQL here keeps setup uniform across all data sets.
        $session = create_db_session();
        $session->exec("INSERT INTO family_member (user_id, name, diet, type) VALUES ($target_user_id, 'test-name', 'vegan', 'child')");
        $session = NULL;

        if ($login_user == "user") parent::loginAsUser();
        else parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/$target_user_id/family-member/1", method:PUT, body:["name"=>"test-name2", "diet"=>"meat", "type"=>"adult", "attendance"=>"will_not_join", "brunch_attendance"=>"undecided"]);

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
        $this->assertEquals("adult", $response->body->family_members[0]->type);
        $this->assertEquals("will_not_join", $response->body->family_members[0]->attendance);
        $this->assertEquals("undecided", $response->body->family_members[0]->brunch_attendance);
    }

    public function testUpdateFamilymemberWithSameValuesReturns200(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/2/family-member", method:POST, body:["name"=>"test-name", "diet"=>"vegan", "type"=>"child"]);
        $response = app($request);
        $this->assertEquals(201, $response->status);

        # Set attendance to will_join so the following update is truly "same values"
        $body = ["name"=>"test-name", "diet"=>"vegan", "type"=>"child", "attendance"=>"will_join", "brunch_attendance"=>"will_join"];
        $request = $this->createRequest(path:"/user/2/family-member/1", method:PUT, body:$body);
        $response = app($request);
        $this->assertEquals(200, $response->status);

        # WHEN
        $request = $this->createRequest(path:"/user/2/family-member/1", method:PUT, body:$body);
        $response = app($request);

        # THEN
        $this->assertEquals(200, $response->status);
        $this->assertInstanceOf(FamilyMember::class, $response->body);
        $this->assertEquals("test-name", $response->body->name);
        $this->assertEquals("vegan", $response->body->diet);
        $this->assertEquals("child", $response->body->type);
        $this->assertEquals("will_join", $response->body->attendance);
        $this->assertEquals("will_join", $response->body->brunch_attendance);
    }

    public function testUpdateFamilymemberNoBodyReturns400(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/1/family-member/1", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(400, $response->status);
    }

    public static function familyMemberUpdatePartialBodies(): array
    {
        return [
            [["diet"=>"vegan", "type"=>"adult", "attendance"=>"will_join", "brunch_attendance"=>"will_join"]],
            [["name"=>"test-name", "type"=>"adult", "attendance"=>"will_join", "brunch_attendance"=>"will_join"]],
            [["name"=>"test-name", "diet"=>"vegan", "attendance"=>"will_join", "brunch_attendance"=>"will_join"]],
            [["name"=>"test-name", "diet"=>"vegan", "type"=>"adult", "brunch_attendance"=>"will_join"]],
            [["name"=>"test-name", "diet"=>"vegan", "type"=>"adult", "attendance"=>"will_join"]],
            [["name"=>NULL, "diet"=>"vegan", "type"=>"adult", "attendance"=>"will_join", "brunch_attendance"=>"will_join"]],
            [["name"=>"test-name", "diet"=>"vegan", "type"=>NULL, "attendance"=>"will_join", "brunch_attendance"=>"will_join"]],
            [["name"=>"test-name", "diet"=>"vegan", "type"=>"adult", "attendance"=>NULL, "brunch_attendance"=>"will_join"]],
            [["name"=>"test-name", "diet"=>"vegan", "type"=>"adult", "attendance"=>"will_join", "brunch_attendance"=>NULL]],
            [["name"=>"test-name", "diet"=>"vegan", "type"=>"bogus", "attendance"=>"will_join", "brunch_attendance"=>"will_join"]],
            [["name"=>"test-name", "diet"=>"vegan", "type"=>"adult", "attendance"=>"bogus", "brunch_attendance"=>"will_join"]],
            [["name"=>"test-name", "diet"=>"vegan", "type"=>"adult", "attendance"=>"will_join", "brunch_attendance"=>"bogus"]],
        ];
    }

    /**
     * @dataProvider familyMemberUpdatePartialBodies
     */
    public function testUpdateFamilymemberPartialBodyReturns422($body): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/2/family-member", method:POST, body:["name"=>"test-name", "diet"=>"vegan", "type"=>"child"]);
        $response = app($request);
        $this->assertEquals(201, $response->status);

        $request = $this->createRequest(path:"/user/2/family-member/1", method:PUT, body:$body);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(422, $response->status);
    }


    # --- family member delete (admin only) ---

    public function testDeleteFamilymemberNoCredentialsReturns401(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user/1/family-member/1", method:DELETE);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(401, $response->status);
    }

    public function testDeleteFamilymemberUserCredentialsSelfReturns403(): void
    {
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/user/2/family-member/1", method:DELETE);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

    public function testDeleteFamilymemberUserCredentialsOtherUserReturns403(): void
    {
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/user/1/family-member/1", method:DELETE);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

    public function testDeleteFamilymemberAdminCannotDeleteOwnFamilyMember(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/1/family-member/1", method:DELETE);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
        $this->assertEquals("admins cannot perform this action on their own account. ask another admin!", $response->body["message"]);
    }

    public function testDeleteNonExistingFamilymemberReturns404(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/2/family-member/1", method:DELETE);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(404, $response->status);
    }

    public function testDeleteFamilymemberDeletes(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/2/family-member", method:POST, body:["name"=>"test-name", "diet"=>"vegan", "type"=>"child"]);
        $response = app($request);
        $this->assertEquals(201, $response->status);

        $request = $this->createRequest(path:"/user/2/family-member/1", method:DELETE);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(204, $response->status);
        $this->assertEquals(NULL, $response->body);
        $request = $this->createRequest(path:"/user", method:GET);
        $response = app($request);
        $this->assertCount(0, $response->body->family_members);
    }

    const USER_JTI = "b4801afabd2ee11a411b1c1ad9de8058e835650b";

    private function getBrunchTokens(int $user_id = 2): array {
        parent::loginAsAdmin();
        $response = app($this->createRequest(path:"/user/$user_id/brunch-tokens", method:GET));
        $this->assertEquals(200, $response->status);
        return $response->body;
    }

    private function seedMixedParty(int $user_id = 2): void {
        $session = create_db_session();
        $session->exec(
            "INSERT INTO family_member (user_id, name, diet, type, attendance) VALUES
                ($user_id, 'joining', NULL, 'adult', 'will_join'),
                ($user_id, 'declined', NULL, 'adult', 'will_not_join'),
                ($user_id, 'unsure',   NULL, 'adult', 'undecided')"
        );
        $session = NULL;
    }

    private function getBrunchAttendances(int $user_id = 2): array {
        $session = create_db_session();
        $stmt = $session->prepare("SELECT name, brunch_attendance FROM family_member WHERE user_id = :id ORDER BY id;");
        $stmt->execute(["id" => $user_id]);
        $rows = $stmt->fetchAll();
        $session = NULL;

        $result = [];
        foreach ($rows as $row) {
            $result[$row["name"]] = $row["brunch_attendance"];
        }
        return $result;
    }

    public function testGetBrunchTokensNoCredentialsReturns401(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user/2/brunch-tokens", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(401, $response->status);
    }

    public function testGetBrunchTokensUserCredentialsReturns403(): void
    {
        # GIVEN
        parent::loginAsUser();

        #WHEN
        $request = $this->createRequest(path:"/user/2/brunch-tokens", method:GET);
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

    public function testGetBrunchTokensReturnsTwoDistinctTokens(): void
    {
        # GIVEN
        parent::loginAsAdmin();

        #WHEN
        $request = $this->createRequest(path:"/user/2/brunch-tokens", method:GET);
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertArrayHasKey("will_join", $response->body);
        $this->assertArrayHasKey("will_not_join", $response->body);
        $this->assertNotEquals($response->body["will_join"], $response->body["will_not_join"]);
    }

    public function testBrunchTokensDoNotLeakTheUserJti(): void
    {
        # GIVEN
        $tokens = $this->getBrunchTokens();

        #WHEN / THEN
        foreach ($tokens as $token) {
            $this->assertStringNotContainsString(self::USER_JTI, $token);

            $payload = AuthService\decode_jwt_token($token);
            $this->assertArrayNotHasKey("jti", $payload);
            $this->assertNotContains(self::USER_JTI, $payload);
        }
    }

    public function testGetLoginTokenNoCredentialsReturns401(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/user/2/login-token", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(401, $response->status);
    }

    public function testGetLoginTokenUserCredentialsReturns403(): void
    {
        # GIVEN
        parent::loginAsUser();

        #WHEN
        $request = $this->createRequest(path:"/user/2/login-token", method:GET);
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
    }

    public function testGetLoginTokenReturnsAWorkingLoginToken(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/2/login-token", method:GET);
        $response = app($request);
        $this->assertEquals(200, $response->status);
        $token = $response->body["token"];
        $this->logout();

        #WHEN
        $request = $this->createRequest(path:"/auth/login", method:POST, body:["token"=>$token]);
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
    }

    public function testGetLoginTokenDoesNotResetTheJti(): void
    {
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/user/2/login-token", method:GET);
        $response = app($request);
        $this->assertEquals(200, $response->status);

        #WHEN / THEN
        $this->assertEquals(self::USER_JTI, \UserRepository\get_user_token_jti(2));
    }

    public function testBrunchRsvpJoinMirrorsTheWeddingAnswer(): void
    {
        # GIVEN
        $tokens = $this->getBrunchTokens();
        $this->seedMixedParty();
        $this->logout();

        #WHEN
        $request = $this->createRequest(path:"/brunch-rsvp", method:PUT, body:["token"=>$tokens["will_join"]]);
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertEquals("will_join", $response->body["brunch_attendance"]);
        $this->assertEquals(1, $response->body["joining"]);
        $this->assertEquals(1, $response->body["undecided"]);
        $this->assertEquals(
            ["joining"=>"will_join", "declined"=>"will_not_join", "unsure"=>"undecided"],
            $this->getBrunchAttendances()
        );
    }

    public function testBrunchRsvpDeclineSetsWholeParty(): void
    {
        # GIVEN
        $tokens = $this->getBrunchTokens();
        $this->seedMixedParty();
        $this->logout();

        #WHEN
        $request = $this->createRequest(path:"/brunch-rsvp", method:PUT, body:["token"=>$tokens["will_not_join"]]);
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertEquals("will_not_join", $response->body["brunch_attendance"]);
        $this->assertEquals(0, $response->body["joining"]);
        $this->assertEquals(0, $response->body["undecided"]);
        $this->assertEquals(
            ["joining"=>"will_not_join", "declined"=>"will_not_join", "unsure"=>"will_not_join"],
            $this->getBrunchAttendances()
        );
    }

    public function testBrunchRsvpIsIdempotent(): void
    {
        # GIVEN
        $tokens = $this->getBrunchTokens();
        $this->seedMixedParty();
        $this->logout();
        $request = $this->createRequest(path:"/brunch-rsvp", method:PUT, body:["token"=>$tokens["will_join"]]);
        $this->assertEquals(200, app($request)->status);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertEquals(
            ["joining"=>"will_join", "declined"=>"will_not_join", "unsure"=>"undecided"],
            $this->getBrunchAttendances()
        );
    }

    public function testBrunchRsvpNoBodyReturns400(): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/brunch-rsvp", method:PUT);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(400, $response->status);
    }

    public static function invalidBrunchTokens(): array
    {
        return [
            "garbage" => ["not-a-token"],
            "empty" => [""],
            "login token replayed" => [self::USER_TOKEN],
            "admin login token replayed" => [self::ADMIN_TOKEN],
        ];
    }

    /**
     * @dataProvider invalidBrunchTokens
     */
    public function testBrunchRsvpInvalidTokenReturns401($token): void
    {
        # GIVEN
        $request = $this->createRequest(path:"/brunch-rsvp", method:PUT, body:["token"=>$token]);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(401, $response->status);
    }

    public function testBrunchTokenIsRevokedByTokenReset(): void
    {
        # GIVEN
        $tokens = $this->getBrunchTokens();

        parent::loginAsAdmin();
        $reset = $this->createRequest(path:"/user/2/reset-token", method:PUT);
        $this->assertEquals(200, app($reset)->status);
        $this->logout();

        #WHEN
        $request = $this->createRequest(path:"/brunch-rsvp", method:PUT, body:["token"=>$tokens["will_join"]]);
        $response = app($request);

        #THEN
        $this->assertEquals(401, $response->status);
    }

    public function testBrunchTokenCannotBeUsedToLogIn(): void
    {
        # GIVEN
        $tokens = $this->getBrunchTokens();
        $this->logout();

        #WHEN
        $request = $this->createRequest(path:"/auth/login", method:POST, body:["token"=>$tokens["will_join"]]);
        $response = app($request);

        #THEN
        $this->assertEquals(401, $response->status);
    }
}

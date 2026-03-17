<?php
require_once 'app.php';
require_once "BaseTestCases.php";

use PHPUnit\Framework\TestCase;

class InfoTest extends ApiIntegrationTestCase
{
    public function testGetOverviewNoCredentialsreturns403(){
        # GIVEN
        $request = $this->createRequest(path:"/info/overview", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
   
    }


    public function assertValidOverview($overview){
        $this->assertIsArray($overview);
        foreach (["date", "arrival_time", "location", "phone"] as $key){
            $this->assertArrayHasKey($key, $overview);
        }
    }

    public function testGetOverviewUserCredentialsreturnsOverview(){
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/info/overview", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertValidOverview($response->body);
    }


    public function testGetOverviewAdminCredentialsreturnsOverview(){
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/info/overview", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertValidOverview($response->body);
    }


    public function testGetAgendaNoCredentialsreturns403(){
        # GIVEN
        $request = $this->createRequest(path:"/info/overview", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
   
    }

    public function assertValidAgenda($agenda){
        $this->assertIsArray($agenda["items"]);
        foreach ($agenda["items"] as $value){
            $this->assertIsString($value["de"]);
            $this->assertIsString($value["fr"]);
        }
    }

    public function testGetAgendaUserCredentialsreturnsOverview(){
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/info/agenda", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertValidAgenda($response->body);
       
    }

    public function testGetAgendaAdminCredentialsreturnsOverview(){
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/info/agenda", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertValidAgenda($response->body);
    }


    public function testGetPaymentDetailsNoCredentialsreturns403(){
        # GIVEN
        $request = $this->createRequest(path:"/info/payment-details", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(403, $response->status);
   
    }

    public function assertValidPaymentDetails($paymentDetails){
        $this->assertIsArray($paymentDetails);
        $this->assertArrayHasKey("bank", $paymentDetails);
        $this->assertIsArray($paymentDetails["bank"]);
        foreach ($agenda["bank"] as $value){
            $this->assertIsString($value);
        }
    }

    public function testGetPaymentDetailsUserCredentialsreturnsOverview(){
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/info/payment-details", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertValidPaymentDetails($response->body);
    }

    public function testGetPaymentDetailsAdminCredentialsreturnsOverview(){
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/info/payment-details", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertValidPaymentDetails($response->body);
    }
}

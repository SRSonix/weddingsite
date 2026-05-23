<?php
require_once 'app.php';
require_once "BaseTestCases.php";

use PHPUnit\Framework\TestCase;

class ImageTest extends ApiIntegrationTestCase
{
    public function testGetImageNoCredentialsreturns401(){
        # GIVEN
        $request = $this->createRequest(path:"/image/test_image.png", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(401, $response->status);

    }

    public function assertValidImageResponse($response){
        $this->assertEquals("image/png", $response->contentType);
    }

    public function testGetImageUserCredentialsreturnsOverview(){
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/image/test_image.png", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertValidImageResponse($response);
    }


    public function testGetImageAdminCredentialsreturnsOverview(){
        # GIVEN
        parent::loginAsAdmin();
        $request = $this->createRequest(path:"/image/test_image.png", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertValidImageResponse($response);
        $this->assertIsString($response->body);
    }


    public function testGetImageOnMissingImageReturns404(){
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/image/bogus.png", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(404, $response->status);
    }

    public function testGetImageReturnsCacheHeaders(){
        # GIVEN
        parent::loginAsUser();
        $request = $this->createRequest(path:"/image/test_image.png", method:GET);

        #WHEN
        $response = app($request);

        #THEN
        $this->assertEquals(200, $response->status);
        $this->assertArrayHasKey('ETag', $response->headers);
        $this->assertArrayHasKey('Last-Modified', $response->headers);
        $this->assertArrayHasKey('Cache-Control', $response->headers);
    }

    public function testGetImageWithMatchingETagReturns304(){
        # GIVEN
        parent::loginAsUser();
        $firstRequest = $this->createRequest(path:"/image/test_image.png", method:GET);
        $firstResponse = app($firstRequest);
        $this->assertEquals(200, $firstResponse->status);
        $etag = $firstResponse->headers['ETag'];

        # WHEN
        $cachedRequest = $this->createRequest(
            path:"/image/test_image.png",
            method:GET,
            headers:['If-None-Match' => $etag]
        );
        $cachedResponse = app($cachedRequest);

        # THEN
        $this->assertEquals(304, $cachedResponse->status);
    }
}

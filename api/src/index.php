<?php

require_once 'app.php';

$request = Request::fromSuperGlobals();
$response = app($request);
$response->handle();


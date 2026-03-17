<?php
namespace InfoController;

require_once "services/info.php";
require_once "exceptions.php";
require_once "controllers/base/request.php";
require_once "controllers/base/response.php";

function get_overview(\Request $request){
    $user_id = $request->getUserIdOrRaise();

    return new \Response(body: \InfoService\get_overview());
}


function get_agenda(\Request $request){
    $user_id = $request->getUserIdOrRaise();

    return new \Response(body: [
        "items" => \InfoService\get_agenda()
    ]);
}


function get_payment_details(\Request $request){
    $user_id = $request->getUserIdOrRaise();

    return new \Response(body: \InfoService\get_payment_details());
}

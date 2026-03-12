<?php
namespace InfoController;

require_once "services/info.php";
require_once "exceptions.php";

function get_overview(\Request $request){
    $user_id = $request->getUserIdOrRaise();

    return \InfoService\get_overview();
}


function get_agenda(\Request $request){
    $user_id = $request->getUserIdOrRaise();

    return [
        "items" => \InfoService\get_agenda()
    ];
}


function get_payment_details(\Request $request){
    $user_id = $request->getUserIdOrRaise();

    return \InfoService\get_payment_details();
}

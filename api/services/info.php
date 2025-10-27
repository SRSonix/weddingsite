<?php

namespace InfoService;

require_once "repositories/info.php";

function get_gifts() {
    return \InfoRepository\get_gifts();
}

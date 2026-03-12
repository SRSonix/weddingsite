<?php

function _log($msg) {
    if (!is_string($msg)) {
        $msg = var_export($msg, true);
    }

    $msg = "myApp - " . date("c") . ": " . $msg."\n";
    $out = fopen('php://stdout', 'w');
    fputs($out, $msg);
    fclose($out);
}

function _empty_line() {
    $out = fopen('php://stdout', 'w');    
    fputs($out, "\n");
    fclose($out);
}

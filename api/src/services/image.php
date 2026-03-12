<?php
namespace ImageService;

require_once "repositories/image.php";

function get_image(string $image_path): array {
    return \ImageRepository\get_image($image_path);
} 
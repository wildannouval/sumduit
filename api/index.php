<?php
// api/index.php

$storagePath = '/tmp/storage';

@mkdir($storagePath . '/framework/views', 0755, true);
@mkdir($storagePath . '/framework/sessions', 0755, true);
@mkdir($storagePath . '/framework/cache', 0755, true);
@mkdir($storagePath . '/framework/cache/data', 0755, true);

// Pastikan Laravel membaca storage path ini
putenv('LARAVEL_STORAGE_PATH=' . $storagePath);
$_ENV['LARAVEL_STORAGE_PATH'] = $storagePath;
$_SERVER['LARAVEL_STORAGE_PATH'] = $storagePath;

require __DIR__ . '/../public/index.php';

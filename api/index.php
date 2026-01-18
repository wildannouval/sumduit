<?php
// api/index.php

$storagePath = '/tmp/storage';

// Buat folder storage di /tmp jika belum ada
if (!is_dir($storagePath . '/framework/views')) {
    @mkdir($storagePath . '/framework/views', 0755, true);
    @mkdir($storagePath . '/framework/sessions', 0755, true);
    @mkdir($storagePath . '/framework/cache', 0755, true);
    @mkdir($storagePath . '/framework/cache/data', 0755, true);
}

// Pastikan Laravel menggunakan path ini
putenv('LARAVEL_STORAGE_PATH=' . $storagePath);

require __DIR__ . '/../public/index.php';

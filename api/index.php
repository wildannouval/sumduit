<?php
// api/index.php

// 1. Paksa folder storage ke /tmp karena hanya itu yang bisa ditulisi di Vercel
$storagePath = '/tmp/storage';
if (!is_dir($storagePath . '/framework/views')) {
    mkdir($storagePath . '/framework/views', 0755, true);
    mkdir($storagePath . '/framework/sessions', 0755, true);
    mkdir($storagePath . '/framework/cache', 0755, true);
}

// 2. Jalankan aplikasi melalui public/index.php asli
require __DIR__ . '/../public/index.php';

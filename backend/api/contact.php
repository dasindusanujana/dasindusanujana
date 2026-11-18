<?php
declare(strict_types=1);

/*
 * Moved to a separate PHP host when one is available.
 * Configure CONTACT_TO and CONTACT_FROM in the hosting environment.
 * This endpoint is not executed by Cloudflare Pages static hosting.
 */
session_start();
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond(int $status, array $body): never {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (empty($_SESSION['contact_csrf'])) {
        $_SESSION['contact_csrf'] = bin2hex(random_bytes(32));
    }
    respond(200, ['csrfToken' => $_SESSION['contact_csrf']]);
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: GET, POST');
    respond(405, ['error' => 'Method not allowed.']);
}

$payload = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($payload)) {
    respond(400, ['error' => 'Invalid request.']);
}
$token = (string)($payload['csrfToken'] ?? '');
if (empty($_SESSION['contact_csrf']) || !hash_equals($_SESSION['contact_csrf'], $token)) {
    respond(403, ['error' => 'Security check failed. Refresh and try again.']);
}
// Honeypot: bots should fill this hidden field; real visitors leave it empty.
if (!empty($payload['website'] ?? '')) {
    respond(200, ['success' => true]);
}

$name = trim((string)($payload['name'] ?? ''));
$email = trim((string)($payload['email'] ?? ''));
$message = trim((string)($payload['message'] ?? ''));

if ($name === '' || mb_strlen($name) > 100 ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 254 ||
    $message === '' || mb_strlen($message) > 5000) {
    respond(422, ['error' => 'Please provide a valid name, email, and message.']);
}

$to = getenv('CONTACT_TO') ?: '';
$from = getenv('CONTACT_FROM') ?: '';
if ($to === '' || $from === '') {
    respond(503, ['error' => 'Contact delivery is not configured yet.']);
}

$subject = 'Portfolio contact message';
$safeName = str_replace(["\r", "\n"], '', $name);
$body = "Name: {$safeName}\nEmail: {$email}\n\nMessage:\n{$message}";
$headers = [
    'From' => $from,
    'Reply-To' => $email,
    'Content-Type' => 'text/plain; charset=UTF-8',
];
if (!mail($to, $subject, $body, $headers)) {
    respond(500, ['error' => 'Message could not be sent. Please try again later.']);
}
unset($_SESSION['contact_csrf']);
respond(200, ['success' => true]);

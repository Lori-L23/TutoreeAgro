@component('mail::message')
# Bienvenue sur CamProduct 👋

Merci de vous être inscrit !

Veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse e-mail :

@php
    $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
    $link = $frontendUrl . '/verify-email?token=' . $token;
@endphp

@component('mail::button', ['url' => $link])
Vérifier mon e-mail
@endcomponent

Ce lien expirera dans 24 heures.

Si vous n'avez pas créé de compte, ignorez cet e-mail.

Merci,  
L’équipe **CamProduct**
@endcomponent

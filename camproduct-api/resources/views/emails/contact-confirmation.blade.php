<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmation de réception</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Merci pour votre message!</h1>
        </div>
        <div class="content">
            <p>Bonjour {{ $message->name }},</p>
            
            <p>Nous avons bien reçu votre message concernant "{{ $message->subject }}" et nous vous remercions de nous avoir contactés.</p>
            
            <div class="info">
                <p><strong>Récapitulatif de votre demande:</strong></p>
                <p><strong>Type:</strong> {{ ucfirst($message->type) }}</p>
                <p><strong>Sujet:</strong> {{ $message->subject }}</p>
                <p><strong>Date d'envoi:</strong> {{ $message->created_at->format('d/m/Y à H:i') }}</p>
            </div>
            
            <p>Notre équipe traitera votre demande dans les plus brefs délais et vous répondra directement à l'adresse email que vous avez fournie.</p>
            
            <p>Cordialement,<br>
            L'équipe CamProduct</p>
        </div>
    </div>
</body>
</html>
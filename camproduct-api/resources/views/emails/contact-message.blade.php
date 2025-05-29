<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nouveau message de contact</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .label { font-weight: bold; color: #10b981; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Nouveau message de contact</h1>
        </div>
        <div class="content">
            <div class="info">
                <p><span class="label">Nom:</span> {{ $message->name }}</p>
                <p><span class="label">Email:</span> {{ $message->email }}</p>
                <p><span class="label">Type:</span> {{ ucfirst($message->type) }}</p>
                <p><span class="label">Sujet:</span> {{ $message->subject }}</p>
                <p><span class="label">Date:</span> {{ $message->created_at->format('d/m/Y à H:i') }}</p>
            </div>
            
            <div class="info">
                <p class="label">Message:</p>
                <p>{{ $message->message }}</p>
            </div>
        </div>
    </div>
</body>
</html>

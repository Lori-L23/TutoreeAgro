<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use App\Mail\ContactMessageMail;
use App\Mail\ContactConfirmationMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * Envoyer un message de contact
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // Validation des données
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'subject' => 'required|string|max:255',
                'message' => 'required|string|max:5000',
                'type' => 'required|in:question,suggestion,reclamation,autres'
            ], [
                'name.required' => 'Le nom est obligatoire',
                'email.required' => 'L\'email est obligatoire',
                'email.email' => 'L\'email doit être valide',
                'subject.required' => 'Le sujet est obligatoire',
                'message.required' => 'Le message est obligatoire',
                'type.required' => 'Le type de demande est obligatoire',
                'type.in' => 'Le type de demande n\'est pas valide'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Créer le message de contact
            $contactMessage = Contact::create($validator->validated());

            // Envoyer l'email de notification à l'admin
            try {
                Mail::to(config('mail.admin_email'))
                    ->send(new ContactMessageMail($contactMessage));
            } catch (\Exception $e) {
                Log::error('Erreur envoi email admin: ' . $e->getMessage());
            }

            // Envoyer l'email de confirmation à l'utilisateur
            try {
                Mail::to($contactMessage->email)
                    ->send(new ContactConfirmationMail($contactMessage));
            } catch (\Exception $e) {
                Log::error('Erreur envoi email confirmation: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
                'data' => [
                    'id' => $contactMessage->id,
                    'status' => $contactMessage->status
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur création message contact: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer.'
            ], 500);
        }
    }

    /**
     * Obtenir tous les messages (pour l'admin)
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Vérification de l'authentification (décommentez si nécessaire)
        // $this->authorize('viewAny', Contact::class);

        $query = Contact::latest();

        // Filtrer par statut
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filtrer par type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $messages = $query->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    /**
     * Voir un message spécifique
     * 
     * @param Contact $contactMessage
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Contact $contactMessage)
    {
        // Marquer comme lu si ce n'est pas déjà fait
        if ($contactMessage->status === 'new') {
            $contactMessage->update(['status' => 'read']);
        }

        return response()->json([
            'success' => true,
            'data' => $contactMessage
        ]);
    }

    /**
     * Mettre à jour le statut d'un message
     * 
     * @param Request $request
     * @param Contact $contactMessage
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request, Contact $contactMessage)
    {
        $request->validate([
            'status' => 'required|in:new,read,replied,closed'
        ]);

        $contactMessage->update([
            'status' => $request->status
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Statut mis à jour avec succès',
            'data' => $contactMessage
        ]);
    }
}
<?php
namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Annotation\Route;

class MessageController extends AbstractController
{
    #[Route('/send-message/{user}', name: 'send_message_to_user', methods: 'POST')]
    public function sendMessageToUser(Request $request, User $user, HubInterface $hub)
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['content'])) {
            return $this->json([
                'error' => 'Message invalide'
            ], 400);
        }

        $message = [
            'message' => $data['content'],
        ];


        $update = new Update(
            [
                "https://example.com/my-private-topic",
                "https://example.com/user/{$user->getId()}/?topic=" . urlencode("https://example.com/my-private-topic")
            ],
            json_encode([
                'content' => $message,
            ]),
            true
        );


        $hub->publish($update);

        return $this->json([
            'message' => 'Message envoyé avec succès'
        ]);
    }
}





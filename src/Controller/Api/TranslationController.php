<?php

namespace App\Controller\Api;

use App\Service\TranslationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class TranslationController extends AbstractController
{
    #[Route('/translate', methods: ['POST'])]
    public function translate(Request $request, TranslationService $service): JsonResponse
    {
        $data = $request->toArray();

        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => $service->translate($data['source'], $data['target'], $data['text'][0])->getTranslation(),
        ]);
    }
}
<?php

namespace App\Controller\Api;

use App\Request\TranslationRequest;
use App\Service\TranslationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class TranslationController extends AbstractController
{
    #[Route('/translate', methods: ['POST'])]
    public function translate(TranslationRequest $request, TranslationService $service): JsonResponse
    {
        foreach ($request->getText() as $item) {
            $translation = $service->translate($request->getSource(), $request->getTarget(), $item);

            return $this->json([
                'message' => 'Welcome to your new controller!',
                'path' => $translation->getTranslation(),
            ]);
        }

        return $this->json([
            'message' => 'Welcome to your new controller!',
        ]);
    }
}
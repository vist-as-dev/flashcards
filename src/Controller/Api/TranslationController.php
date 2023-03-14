<?php

namespace App\Controller\Api;

use App\Provider\TranslationServiceProvider;
use App\Request\TranslationRequest;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class TranslationController extends AbstractController
{
    #[Route('/translate', methods: ['POST'])]
    public function translate(
        TranslationRequest $request,
        TranslationServiceProvider $serviceProvider,
    ): JsonResponse
    {
        $service = $serviceProvider->getService($request);
        $rows = $service->translate($request->getText());

        return $this->json([
            'content' => join(PHP_EOL, $rows),
        ]);
    }
}
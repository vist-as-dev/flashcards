<?php

namespace App\Controller\Api;

use App\Provider\TranslationServiceProvider;
use App\Request\SetImageRequest;
use App\Request\TranslationRequest;
use App\Service\SetImageService;
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

        return $this->json([
            'content' => $service->translate($request->getText())->content(),
        ]);
    }

    #[Route('/image', methods: ['POST'])]
    public function image(
        SetImageRequest $request,
        SetImageService $service,
    ): JsonResponse
    {
        $service->set($request);

        return $this->json(null);
    }
}
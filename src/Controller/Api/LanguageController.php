<?php

namespace App\Controller\Api;

use App\Service\LanguageService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class LanguageController extends AbstractController
{
    #[Route('/language', methods: ['GET'])]
    public function upload(LanguageService $service): JsonResponse
    {
        return $this->json($service->list());
    }
}
<?php

namespace App\Controller\Api;

use App\Provider\FormatterProvider;
use App\Request\TranslationRequest;
use App\Service\TranslationFactory;
use App\Service\TranslationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class TranslationController extends AbstractController
{
    #[Route('/translate', methods: ['POST'])]
    public function translate(
        TranslationRequest $request,
        TranslationService $service,
        TranslationFactory $factory,
        FormatterProvider $provider,
    ): JsonResponse
    {
        $rows = [];
        foreach ($request->getText() as $item) {
            $translation = $service->translate($request->getSource(), $request->getTarget(), $item);
            $model = $factory->create($translation->getTranslation());
            $formatter = $provider->getFormatter($request->format());
            $rows[] = $formatter->format(
                $model,
                $request->hasDefinitions(),
                $request->hasDefinitionExamples(),
                $request->hasDefinitionSynonyms(),
                $request->hasExamples(),
            );
        }

        return $this->json([
            'csv' => join(PHP_EOL, $rows),
        ]);
    }
}
<?php

namespace App\Controller\Api;

use App\Provider\FormatterProvider;
use App\Request\TranslationRequest;
use App\Service\TranslationFactory;
use App\Service\TranslationService;
use Psr\Log\LoggerInterface;
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
        LoggerInterface $logger,
    ): JsonResponse
    {
        $formatter = $provider->getFormatter($request);

        $rows = [];
        foreach ($request->getText() as $item) {
            $logger->debug($item);
            $translation = $service->translate($request->getSource(), $request->getTarget(), $item);
            $translation = $translation->getTranslation();
            $model = $factory->create($translation);
            $rows[] = $formatter->format($model);

            if ($request->hasRelatedWords() && !empty($model->getRelatedWords())) {
                foreach ($model->getRelatedWords() as $relatedWord) {
                    $translation = $service->translate($request->getSource(), $request->getTarget(), $relatedWord);
                    $rows[] = $formatter->format(
                        $factory->create($translation->getTranslation())
                    );
                }
            }
        }

        return $this->json([
            'content' => join(PHP_EOL, $rows),
        ]);
    }
}
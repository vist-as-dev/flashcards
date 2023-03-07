<?php

namespace App\Service;

use App\Entity\Translation;
use App\Entity\Translations\English;
use App\Entity\Translations\Spanish;
use App\Entity\Translations\French;
use App\Entity\Translations\German;
use App\Entity\Translations\Italian;
use App\Entity\Translations\Polish;
use App\Entity\Translations\Ukrainian;
use App\Entity\Translations\Russian;
use App\Repository\TranslationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\NonUniqueResultException;

class TranslationService
{
    protected EntityManagerInterface $em;
    protected GoogleTranslate $gt;

    public function __construct(EntityManagerInterface $em, GoogleTranslate $gt)
    {
        $this->em = $em;
        $this->gt = $gt;
    }

    /**
     * @throws NonUniqueResultException
     * @throws \Exception
     */
    public function translate($source, $target, $word): ?Translation
    {
        $model = $this->model($source, $target);
        if (null === $model) {
            throw new \Exception('translation direction not supported');
        }

        $translationRepo = $this->em->getRepository($model);

        /** @var Translation $row */
        $row = $translationRepo->findOneBy(['original' => $word]);
        if (null === $row) {
            if (false === $response = $this->gt->translate($source, $target, $word)) {
                return null;
            }

            $row = new $model();
            $row->setOriginal($word);
            $row->setTranslation($response);
            $this->em->persist($row);
        }

        $row->addCounter();
        $this->em->flush();

        return $row;
    }

    protected function model(string $source, string $target): ?string
    {
        $models = [
            'en' => [
                'es' => English\Spanish::class,
                'fr' => English\French::class,
                'de' => English\German::class,
                'it' => English\Italian::class,
                'pl' => English\Polish::class,
                'uk' => English\Ukrainian::class,
                'ru' => English\Russian::class,
            ],
            'es' => [
                'en' => Spanish\English::class,
                'fr' => Spanish\French::class,
                'de' => Spanish\German::class,
                'it' => Spanish\Italian::class,
                'pl' => Spanish\Polish::class,
                'uk' => Spanish\Ukrainian::class,
                'ru' => Spanish\Russian::class,
            ],
            'fr' => [
                'es' => French\Spanish::class,
                'en' => French\English::class,
                'de' => French\German::class,
                'it' => French\Italian::class,
                'pl' => French\Polish::class,
                'uk' => French\Ukrainian::class,
                'ru' => French\Russian::class,
            ],
            'de' => [
                'es' => German\Spanish::class,
                'fr' => German\French::class,
                'en' => German\English::class,
                'it' => German\Italian::class,
                'pl' => German\Polish::class,
                'uk' => German\Ukrainian::class,
                'ru' => German\Russian::class,
            ],
            'it' => [
                'es' => Italian\Spanish::class,
                'fr' => Italian\French::class,
                'de' => Italian\German::class,
                'en' => Italian\English::class,
                'pl' => Italian\Polish::class,
                'uk' => Italian\Ukrainian::class,
                'ru' => Italian\Russian::class,
            ],
            'pl' => [
                'es' => Polish\Spanish::class,
                'fr' => Polish\French::class,
                'de' => Polish\German::class,
                'en' => Polish\English::class,
                'it' => Polish\Italian::class,
                'uk' => Polish\Ukrainian::class,
                'ru' => Polish\Russian::class,
            ],
            'uk' => [
                'es' => Ukrainian\Spanish::class,
                'fr' => Ukrainian\French::class,
                'de' => Ukrainian\German::class,
                'en' => Ukrainian\English::class,
                'pl' => Ukrainian\Polish::class,
                'it' => Ukrainian\Italian::class,
                'ru' => Ukrainian\Russian::class,
            ],
            'ru' => [
                'es' => Russian\Spanish::class,
                'fr' => Russian\French::class,
                'de' => Russian\German::class,
                'en' => Russian\English::class,
                'pl' => Russian\Polish::class,
                'uk' => Russian\Ukrainian::class,
                'it' => Russian\Italian::class,
            ],
        ];

        return ($models[$source] ?? [])[$target] ?? null;
    }
}
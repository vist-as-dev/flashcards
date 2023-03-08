<?php

namespace App\Service;

use App\Entity\Translation;
use App\Provider\LanguageProvider;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\NonUniqueResultException;

class TranslationService
{
    protected EntityManagerInterface $em;
    protected GoogleTranslate $gt;
    protected LanguageProvider $lp;

    public function __construct(EntityManagerInterface $em, GoogleTranslate $gt, LanguageProvider $lp)
    {
        $this->em = $em;
        $this->gt = $gt;
        $this->lp = $lp;
    }

    /**
     * @throws NonUniqueResultException
     * @throws \Exception
     */
    public function translate($source, $target, $word): ?Translation
    {
        $entity = $this->lp->getEntity($source, $target);
        if (null === $entity) {
            throw new \Exception('translation direction not supported');
        }

        $translationRepo = $this->em->getRepository($entity);

        /** @var Translation $row */
        $row = $translationRepo->findOneBy(['original' => $word]);
        if (null === $row) {
            if (false === $response = $this->gt->translate($source, $target, $word)) {
                return null;
            }

            $row = new $entity();
            $row->setOriginal($word);
            $row->setTranslation($response);
            $this->em->persist($row);
        }

        $row->addCounter();
        $this->em->flush();

        return $row;
    }
}
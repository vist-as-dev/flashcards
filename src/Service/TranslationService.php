<?php

namespace App\Service;

use App\Entity\Translation;
use App\Provider\LanguageProvider;
use App\Request\TranslationRequest;
use App\Service\Formatter\FormatterInterface;
use App\Service\TranslationFactory\TranslationFactoryInterface;
use Doctrine\ORM\EntityManagerInterface;

class TranslationService
{
    protected EntityManagerInterface $em;
    protected GoogleTranslate $gt;
    protected LanguageProvider $lp;

    protected TranslationFactoryInterface $factory;
    protected FormatterInterface $formatter;
    protected TranslationRequest $request;

    public function __construct(EntityManagerInterface $em, GoogleTranslate $gt, LanguageProvider $lp)
    {
        $this->em = $em;
        $this->gt = $gt;
        $this->lp = $lp;
    }

    /**
     * @param array $words
     * @return array
     */
    public function translate(array $words, $layer = 0): array
    {
        $from = $this->request->getSource();
        $to = $this->request->getTarget();
        $withRelatedWords = $this->request->hasRelatedWords();

        $rows = [];
        foreach ($words as $word) {
            $data = $this->download($from, $to, $word);
            if (null === $data) {
                continue;
            }

            $models = $this->factory->create($data->getTranslation());
            if (!empty($models)) {
                foreach ($models as $model) {
                    $rows[] = $this->formatter->format($model);

                    if ($layer == 0 && $withRelatedWords && !empty($model->getRelatedWords())) {
                        $rows = array_merge($rows, $this->translate($model->getRelatedWords(), ++$layer));
                    }
                }
            }

        }

        return $rows;
    }

    protected function download($source, $target, $word): ?Translation
    {
        $entity = $this->lp->getEntity($source, $target);
        if (null === $entity) {
            return null;
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

            $data = $row->getTranslation();
            $orig = $data['sentences'][0]['orig'];
            $trans = $data['sentences'][0]['trans'];

            if (strlen($word) < 60 && ($orig !== $trans || isset($data['dict']))) {
                $this->em->persist($row);
            }
        }

        $row->addCounter();

        $this->em->flush();

        return $row;
    }

    /**
     * @param TranslationFactoryInterface $factory
     * @return TranslationService
     */
    public function setFactory(TranslationFactoryInterface $factory): TranslationService
    {
        $this->factory = $factory;
        return $this;
    }

    /**
     * @param FormatterInterface $formatter
     * @return TranslationService
     */
    public function setFormatter(FormatterInterface $formatter): TranslationService
    {
        $this->formatter = $formatter;
        return $this;
    }

    /**
     * @param TranslationRequest $request
     * @return TranslationService
     */
    public function setRequest(TranslationRequest $request): TranslationService
    {
        $this->request = $request;
        return $this;
    }
}
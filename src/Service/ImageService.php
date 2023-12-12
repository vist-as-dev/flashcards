<?php

namespace App\Service;

use App\Entity\Translation;
use App\Provider\LanguageProvider;
use App\Request\SetImageRequest;
use Doctrine\ORM\EntityManagerInterface;

class ImageService
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

    public function set(SetImageRequest $request)
    {
        $source = $request->getSource();
        $target = $request->getTarget();
        $original = $request->getOriginal();
        $image = $request->getImage();

        $entity = $this->lp->getEntity($source, $target);
        if (null === $entity) {
            return null;
        }

        $translationRepo = $this->em->getRepository($entity);

        /** @var Translation $row */
        $row = $translationRepo->findOneBy(['original' => $original]);
        if (null !== $row) {
            $row->setImage($image);
            $this->em->flush();
        } else {
            if (false === $response = $this->gt->translate($source, $target, $original)) {
                return null;
            }

            $row = $translationRepo->findOneBy(['original' => $original]);
            if (null === $row) {
                /** @var Translation $row */
                $row = new $entity();
                $row->setOriginal($original);
                $row->setTranslation($response);
                $row->setImage($image);

                $data = $row->getTranslation();
                $orig = $data['sentences'][0]['orig'];
                $trans = $data['sentences'][0]['trans'];

                if (strlen($original) < 60 && ($orig !== $trans || isset($data['dict']))) {
                    $this->em->persist($row);
                    $this->em->flush();
                }
            }
        }
    }

    public function get(string $source, string $target, string $original): ?string
    {
        $entity = $this->lp->getEntity($source, $target);
        if (null === $entity) {
            return null;
        }

        $translationRepo = $this->em->getRepository($entity);

        /** @var Translation $row */
        $row = $translationRepo->findOneBy(['original' => $original]);

        return $row?->getImage();
    }
}
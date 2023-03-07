<?php

namespace App\Entity\Translations\German;


use App\Entity\Translation;
use App\Repository\TranslationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_german_to_french')]
#[ORM\Entity(repositoryClass: TranslationRepository::class)]
class French extends Translation
{

}
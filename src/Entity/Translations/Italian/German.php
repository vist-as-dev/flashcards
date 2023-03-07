<?php

namespace App\Entity\Translations\Italian;


use App\Entity\Translation;
use App\Repository\TranslationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_italian_to_german')]
#[ORM\Entity(repositoryClass: TranslationRepository::class)]
class German extends Translation
{

}
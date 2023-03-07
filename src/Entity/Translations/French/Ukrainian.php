<?php

namespace App\Entity\Translations\French;


use App\Entity\Translation;
use App\Repository\TranslationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_french_to_ukrainian')]
#[ORM\Entity(repositoryClass: TranslationRepository::class)]
class Ukrainian extends Translation
{

}
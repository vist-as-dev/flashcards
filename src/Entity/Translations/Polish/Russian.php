<?php

namespace App\Entity\Translations\Polish;


use App\Entity\Translation;
use App\Repository\TranslationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_polish_to_russian')]
#[ORM\Entity(repositoryClass: TranslationRepository::class)]
class Russian extends Translation
{

}
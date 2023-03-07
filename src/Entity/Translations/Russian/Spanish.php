<?php

namespace App\Entity\Translations\Russian;


use App\Entity\Translation;
use App\Repository\TranslationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_russian_to_spanish')]
#[ORM\Entity(repositoryClass: TranslationRepository::class)]
class Spanish extends Translation
{

}
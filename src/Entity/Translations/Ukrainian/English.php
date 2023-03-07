<?php

namespace App\Entity\Translations\Ukrainian;


use App\Entity\Translation;
use App\Repository\TranslationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_ukrainian_to_english')]
#[ORM\Entity(repositoryClass: TranslationRepository::class)]
class English extends Translation
{

}
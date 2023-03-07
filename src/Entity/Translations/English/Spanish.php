<?php

namespace App\Entity\Translations\English;


use App\Entity\Translation;
use App\Repository\TranslationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_english_to_spanish')]
#[ORM\Entity]
class Spanish extends Translation
{

}
<?php

namespace App\Entity\Translations\Russian;


use App\Entity\Translation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_russian_to_german')]
#[ORM\Entity]
class German extends Translation
{

}
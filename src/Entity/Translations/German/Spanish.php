<?php

namespace App\Entity\Translations\German;


use App\Entity\Translation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_german_to_spanish')]
#[ORM\Entity]
class Spanish extends Translation
{

}
<?php

namespace App\Entity\Translations\Spanish;


use App\Entity\Translation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_spanish_to_english')]
#[ORM\Entity]
class English extends Translation
{

}
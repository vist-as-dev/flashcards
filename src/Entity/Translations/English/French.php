<?php

namespace App\Entity\Translations\English;


use App\Entity\Translation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_english_to_french')]
#[ORM\Entity]
class French extends Translation
{

}
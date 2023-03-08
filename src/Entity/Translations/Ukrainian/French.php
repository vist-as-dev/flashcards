<?php

namespace App\Entity\Translations\Ukrainian;


use App\Entity\Translation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_ukrainian_to_french')]
#[ORM\Entity]
class French extends Translation
{

}
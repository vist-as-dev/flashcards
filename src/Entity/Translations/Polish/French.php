<?php

namespace App\Entity\Translations\Polish;


use App\Entity\Translation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_polish_to_french')]
#[ORM\Entity]
class French extends Translation
{

}
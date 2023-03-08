<?php

namespace App\Entity\Translations\French;


use App\Entity\Translation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_french_to_polish')]
#[ORM\Entity]
class Polish extends Translation
{

}
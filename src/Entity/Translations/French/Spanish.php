<?php

namespace App\Entity\Translations\French;


use App\Entity\Translation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_french_to_spanish')]
#[ORM\Entity]
class Spanish extends Translation
{

}
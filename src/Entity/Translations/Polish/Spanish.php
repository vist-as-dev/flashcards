<?php

namespace App\Entity\Translations\Polish;


use App\Entity\Translation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_polish_to_spanish')]
#[ORM\Entity]
class Spanish extends Translation
{

}
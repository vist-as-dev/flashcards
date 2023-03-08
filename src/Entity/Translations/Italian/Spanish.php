<?php

namespace App\Entity\Translations\Italian;


use App\Entity\Translation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_italian_to_spanish')]
#[ORM\Entity]
class Spanish extends Translation
{

}
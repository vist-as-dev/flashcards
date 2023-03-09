<?php

namespace App\Entity\Translations\Ukrainian;


use App\Entity\Translation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_ukrainian_to_spanish')]
#[ORM\Entity]
class Spanish extends Translation
{

}
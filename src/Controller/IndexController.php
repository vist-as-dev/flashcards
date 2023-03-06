<?php

namespace App\Controller;

use Symfony\Bridge\Twig\Attribute\Template;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class IndexController extends AbstractController
{
    #[Route('/', name: 'app_index', methods: ['GET'])]
    #[Template('index.html.twig')]
    public function index(): array
    {
        return [
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/IndexController.php',
        ];
    }
}

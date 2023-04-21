<?php

namespace App\Controller;

use DateTime;
use Google\Client;
use Google\Service\Drive;
use Google\Service\Speech;
use Symfony\Bridge\Twig\Attribute\Template;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/auth')]
class AuthController extends AbstractController
{
    #[Route('/', name: 'app_auth', methods: ['GET'])]
    public function auth(Request $request, Client $client): RedirectResponse
    {
        $client->addScope(Drive::DRIVE);
        $client->addScope(Drive::DRIVE_APPDATA);
        $client->addScope(Speech::CLOUD_PLATFORM);
        $client->setRedirectUri($request->getScheme() . '://' . $request->getHost() . '/auth/complete');
        $client->setAccessType('offline');

        $client->setPrompt('consent');
        $client->setIncludeGrantedScopes(true);

        $auth_url = $client->createAuthUrl();

        return $this->redirect($auth_url);
    }

    #[Route('/complete', name: 'app_auth_complete', methods: ['GET'])]
    public function authComplete(Request $request, Client $client, \Predis\Client $redis): RedirectResponse
    {
        $code = $request->query->get('code');
        $client->setRedirectUri($request->getScheme() . '://' . $request->getHost() . '/auth/complete');

        $token = $client->fetchAccessTokenWithAuthCode($code);
        if (isset($token['access_token']) && isset($token['refresh_token'])) {
            $redis->set($token['access_token'], $token['refresh_token'], 'EX', 30 * 24 * 60 * 60);
        }

        $response = $this->redirect('/');
        $response->headers->setCookie(new Cookie(
            "access-token",
            $token['access_token'],
            (new DateTime('now'))->modify("+1 day"),
            "/",
            null,
            $request->getScheme() === 'http',
            false,
            true,
            'Strict'
        ));

        return $response;
    }

    #[Route('/refresh', name: 'app_auth_refresh', methods: ['GET'])]
    public function authRefresh(Request $request, Client $client, \Predis\Client $redis): JsonResponse
    {
        $accessToken = $request->cookies->get('access-token');
        if (!$accessToken) {
            return $this->json(['error' => 'access token not found'], 400);
        }

        $refreshToken = $redis->get($accessToken) ?? '';
        $token = $client->fetchAccessTokenWithRefreshToken($refreshToken);

        if (isset($token['access_token'])) {
            $redis->set($token['access_token'], $refreshToken, 'EX', 30 * 24 * 60 * 60);
            $redis->expire($accessToken, 0);
        }

        $response = new JsonResponse();
        $response->headers->setCookie(new Cookie(
            "access-token",
            $token['access_token'] ?? '',
            (new DateTime('now'))->modify("+1 day"),
            "/",
            null,
            $request->getScheme() === 'http',
            false,
            true,
            'Strict'
        ));

        return $response;
    }
}

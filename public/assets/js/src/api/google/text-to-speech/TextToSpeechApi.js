import {TokenService} from "../../../service/TokenService";

const voices = {
    'en': {
        code: 'en-US',
        name: 'en-US-Neural2-C',
    },
    'es': {
        code: 'es-ES',
        name: 'es-ES-Neural2-D',
    },
    'fr': {
        code: 'fr-FR',
        name: 'fr-FR-Wavenet-E',
    },
    'de': {
        code: 'de-DE',
        name: 'de-DE-Wavenet-C',
    },
    'it': {
        code: 'it-IT',
        name: 'it-IT-Wavenet-A',
    },
    'pl': {
        code: 'pl-PL',
        name: 'pl-PL-Standard-E',
    },
    'uk': {
        code: 'uk-UA',
        name: 'uk-UA-Standard-A',
    },
    'ru': {
        code: 'ru-RU',
        name: 'ru-RU-Standard-C',
    },
}

export class TextToSpeechApi {
    static async speech(text) {
        if (!TokenService.getToken()) {
            window.location.href = `${location.protocol}//${location.host}/auth`;
        } else if (window.gapi) {
            window.gapi.client.setToken({access_token: TokenService.getToken()});
        }

        const {code, name} = voices[document.querySelector('header select#source').value || 'en'];

        fetch('https://texttospeech.googleapis.com/v1/text:synthesize/', {
            body: JSON.stringify({
                input: {text},
                voice: {
                    languageCode: code,
                    name: name,
                    ssmlGender: "FEMALE",
                },
                audioConfig: {audioEncoding: "MP3"},
            }),
            headers: {
                Authorization: 'Bearer ' + gapi.auth.getToken().access_token,
                'Content-Type': 'application/json; charset=utf-8'
            },
            method: 'POST'
        })
            .then(response => response.json())
            .then(({audioContent}) => {
                const audio = new Audio('data:audio/mp3;base64,' + audioContent);
                audio.play();
            }).catch(async (err) => {
                if ([401, 403].includes(err.status) && window.gapi) {
                    window.gapi.client.setToken({access_token: await TokenService.refreshToken()});
                }
            });
    }
}
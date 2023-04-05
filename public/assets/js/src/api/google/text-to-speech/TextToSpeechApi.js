export class TextToSpeechApi {
    static async speech(text, languageCode = "en-US") {
        fetch('https://texttospeech.googleapis.com/v1/text:synthesize/', {
            body: JSON.stringify({
                input: {text},
                voice: {
                    languageCode,
                    name: "en-US-Neural2-C",
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
            })
    }
}
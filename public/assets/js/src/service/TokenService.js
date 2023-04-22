export class TokenService {
    static getToken() {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("access-token="))
            ?.split("=")[1] || localStorage.getItem('token');

        if (!token || 'null' === token) {
            window.location.href = `${location.protocol}//${location.host}/auth`;
        }

        return token;
    }

    static async refreshToken() {
        document.cookie = `access-token=${TokenService.getToken()}; SameSite=None; Secure`;
        await fetch('/auth/refresh');

        const token = TokenService.getToken();
        localStorage.setItem('token', token);

        window.gapi.client.setToken({access_token: token});

        return token;
    }
}
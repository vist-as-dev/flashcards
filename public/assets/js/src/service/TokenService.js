export class TokenService {
    static getToken() {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("access-token="))
            ?.split("=")[1];

        return token || localStorage.getItem('token');
    }

    static async refreshToken() {
        document.cookie = `access-token=${TokenService.getToken()}; SameSite=None; Secure`;
        await fetch('/auth/refresh');
        const token = TokenService.getToken();
        localStorage.setItem('token', token);
        return token;
    }
}
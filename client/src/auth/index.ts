import auth from '../constants/auth.json'
import { decode } from 'jsonwebtoken'

export default class AuthService {
  public static saveToken(token: string): void {
    // Cookie.set(auth.COOKIE_AUTH_TOKEN, token);
    localStorage.setItem(auth.COOKIE_AUTH_TOKEN, token);
  }

  public static clearToken(): void {
    // Cookie.remove(auth.COOKIE_AUTH_TOKEN);
    localStorage.removeItem(auth.COOKIE_AUTH_TOKEN);
  }

  public static getToken(): string {
    // return Cookie.get(auth.COOKIE_AUTH_TOKEN) || '';
    const token = localStorage.getItem(auth.COOKIE_AUTH_TOKEN) || '';

    if (token === '') {
      return ''
    }

     try {
      const { exp } = decode(token) as any;
      if (exp < (new Date().getTime() + 1) / 1000) {
        AuthService.clearToken()
        return '';
      }
    } catch (err) {
      console.log(err)
      return '';
    }

    return token
  }

  public static hasToken(): boolean {
    // const token =  Cookie.get(auth.COOKIE_AUTH_TOKEN);
    let token = AuthService.getToken()
    return (token !== undefined && token.length > 0)
  }
}
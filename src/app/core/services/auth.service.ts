import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from './api-config';

interface TokenResponse {
  accessToken: string;
  expiresAtUtc: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'tagperson.api.token';
  private expirationKey = 'tagperson.api.token.expiration';

  constructor(private http: HttpClient) {}

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  set token(value: string | null) {
    if (value) {
      localStorage.setItem(this.tokenKey, value);
    } else {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.expirationKey);
    }
  }

  private get expirationTime(): number | null {
    const exp = localStorage.getItem(this.expirationKey);
    return exp ? parseInt(exp, 10) : null;
  }

  private set expirationTime(value: number | null) {
    if (value) {
      localStorage.setItem(this.expirationKey, value.toString());
    } else {
      localStorage.removeItem(this.expirationKey);
    }
  }

  async login(username: string, password: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<TokenResponse>(`${API_BASE_URL}/auth/token`, { username, password })
    );
    this.token = res.accessToken;

    // Armazenar tempo de expiração
    const expirationDate = new Date(res.expiresAtUtc);
    this.expirationTime = expirationDate.getTime();
  }

  isTokenValid(): boolean {
    const token = this.token;
    const expiration = this.expirationTime;

    if (!token || !expiration) {
      return false;
    }

    // Verificar se o token ainda não expirou
    const now = new Date().getTime();
    if (now > expiration) {
      this.logout();
      return false;
    }

    return true;
  }

  logout(): void {
    this.token = null;
  }

  async ensureToken(): Promise<boolean> {
    return this.isTokenValid();
  }
}

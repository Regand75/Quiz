import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import {LoginResponseType} from "../../../types/login-response.type";
import {Observable, Subject, tap} from "rxjs";
import {UserInfoType} from "../../../types/user-info.type";
import { LogoutResponseType } from 'src/types/logout-response.type';
import {SignupResponseType} from "../../../types/signup-response.type";
import {RefreshResponseType} from "../../../types/refresh-response.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  accessTokenKey: string = 'accessToken';
  private refreshTokenKey: string = 'refreshToken';
  private userInfoKey: string = 'userInfo';
  private userEmailKey: string = 'userEmail';

  isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged = false;

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  login(email: string, password: string): Observable<LoginResponseType> {
    return this.http.post<LoginResponseType>(environment.apiHost + "login", {
      email,
      password,
    })
      .pipe(
        tap((data: LoginResponseType) => {
          if (data.fullName && data.userId && data.accessToken && data.refreshToken) {
            this.setUserInfo({
              fullName: data.fullName,
              userId: data.userId,
            });
            this.setToken(data.accessToken, data.refreshToken);
          }
        })
      );
  }

  signup(name: string, lastName: string, email: string, password: string): Observable<SignupResponseType> {
    return this.http.post<SignupResponseType>(environment.apiHost + "signup", {
      name,
      lastName,
      email,
      password,
    });
  }

  refresh(): Observable<RefreshResponseType> {
    const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
    return this.http.post<RefreshResponseType>(environment.apiHost + 'refresh', {refreshToken});
  }

  logout(): Observable<LogoutResponseType> {
    const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
    return this.http.post<LogoutResponseType>(environment.apiHost + "logout", {refreshToken});
  }

  getLoggedIn(): boolean {
    return this.isLogged;
  }

  setToken(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  removeToken(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  setUserEmail(email: string): void {
    localStorage.setItem(this.userEmailKey, JSON.stringify(email));
  }

  getUserEmail(): string | null {
    const userEmail: string | null = localStorage.getItem(this.userEmailKey);
    if (userEmail) {
      return JSON.parse(userEmail);
    }
    return null;
  }

  setUserInfo(info: UserInfoType): void {
    localStorage.setItem(this.userInfoKey, JSON.stringify(info));
  }

  removeUserInfo(): void {
    localStorage.removeItem(this.userInfoKey);
  }

  getTokens(): {accessToken: string | null, refreshToken: string | null} {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    }
  };

  getUserInfo(): UserInfoType | null {
    const userInfo: string | null = localStorage.getItem(this.userInfoKey);
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    return null;
  }
}

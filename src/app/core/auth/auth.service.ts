import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import {LoginResponseType} from "../../../types/login-response.type";
import {Observable, Subject} from "rxjs";
import {UserInfoType} from "../../../types/user-info.type";
import { LogoutResponseType } from 'src/types/logout-response.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public accessTokenKey: string = 'accessToken';
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
    });
  }

  logout(): Observable<LogoutResponseType> {
    const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
    return this.http.post<LogoutResponseType>(environment.apiHost + "logout", {refreshToken});
  }

  getLoggedIn(): boolean {
    return this.isLogged;
  }

  public setToken(accessToken: string, refreshToken: string): void {
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

  public setUserEmail(email: string): void {
    localStorage.setItem(this.userEmailKey, JSON.stringify(email));
  }

  public getUserEmail(): string | null {
    const userEmail: string | null = localStorage.getItem(this.userEmailKey);
    if (userEmail) {
      return JSON.parse(userEmail);
    }
    return null;
  }

  public setUserInfo(info: UserInfoType): void {
    localStorage.setItem(this.userInfoKey, JSON.stringify(info));
  }

  public removeUserInfo(): void {
    localStorage.removeItem(this.userInfoKey);
  }

  public getUserInfo(): UserInfoType | null {
    const userInfo: string | null = localStorage.getItem(this.userInfoKey);
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    return null;
  }
}

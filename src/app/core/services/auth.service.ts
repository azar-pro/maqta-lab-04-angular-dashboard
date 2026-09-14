import { Injectable, signal } from '@angular/core';
@Injectable({providedIn:'root'})
export class AuthService {
  readonly isAuthenticated = signal(localStorage.getItem('rivet-auth') === '1');
  login(email:string, password:string): boolean {
    const ok = email.trim().length > 4 && password.length >= 6;
    if(ok){ localStorage.setItem('rivet-auth','1'); this.isAuthenticated.set(true); }
    return ok;
  }
  logout(){ localStorage.removeItem('rivet-auth'); this.isAuthenticated.set(false); }
}

import { Injectable, signal } from '@angular/core';
@Injectable({providedIn:'root'})
export class ThemeService {
  readonly dark = signal(localStorage.getItem('rivet-theme') === 'dark');
  constructor(){ this.apply(); }
  toggle(){ this.dark.update(v=>!v); localStorage.setItem('rivet-theme', this.dark()?'dark':'light'); this.apply(); }
  private apply(){ document.documentElement.dataset['theme'] = this.dark() ? 'dark' : 'light'; }
}

import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { BusinessDataService } from '../../core/services/business-data.service';
@Component({selector:'app-shell',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive],template:`
<div class="app-shell">
  <aside class="sidebar" [class.open]="menuOpen()">
    <a class="workspace-brand" routerLink="/app/overview" (click)="closeMenu()"><span class="brand-mark small">R</span><span>RIVET</span></a>
    <nav aria-label="Primary">
      <a routerLink="/app/overview" routerLinkActive="active" (click)="closeMenu()"><span>◫</span>Overview</a>
      <a routerLink="/app/projects" routerLinkActive="active" (click)="closeMenu()"><span>▥</span>Projects</a>
      <a routerLink="/app/customers" routerLinkActive="active" (click)="closeMenu()"><span>◎</span>Customers</a>
      <a routerLink="/app/inventory" routerLinkActive="active" (click)="closeMenu()"><span>◇</span>Inventory</a>
      <a routerLink="/app/tasks" routerLinkActive="active" (click)="closeMenu()"><span>✓</span>Tasks</a>
    </nav>
    <div class="nav-section">WORKSPACE</div>
    <nav>
      <a routerLink="/app/notifications" routerLinkActive="active" (click)="closeMenu()"><span>◌</span>Notifications @if(data.unreadNotifications()){<b class="count">{{data.unreadNotifications()}}</b>}</a>
      <a routerLink="/app/settings" routerLinkActive="active" (click)="closeMenu()"><span>⚙</span>Settings</a>
    </nav>
    <div class="sidebar-foot"><div class="avatar">MF</div><div><strong>Mina Farrow</strong><small>Operations lead</small></div><button (click)="logout()" aria-label="Log out">↗</button></div>
  </aside>
  @if(menuOpen()){<button class="mobile-scrim" (click)="closeMenu()" aria-label="Close menu"></button>}
  <section class="main-area">
    <header class="topbar"><button class="menu-btn" (click)="menuOpen.update(v=>!v)" aria-label="Toggle menu">☰</button><button class="global-search" (click)="openSearch()"><span>⌕</span> Search projects, clients, tasks <kbd>Ctrl K</kbd></button><div class="top-actions"><button (click)="theme.toggle()" [attr.aria-label]="theme.dark()?'Use light mode':'Use dark mode'">{{theme.dark()?'☀':'◐'}}</button><a routerLink="/app/notifications" aria-label="Notifications" class="notification-link">◌ @if(data.unreadNotifications()){<i></i>}</a><a routerLink="/app/profile" class="avatar small-avatar" aria-label="Profile">MF</a></div></header>
    <main class="content">
      @if(data.isLoading()){
        <section class="workspace-loading" aria-live="polite" aria-busy="true">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton-kpis">@for(item of [1,2,3,4];track item){<div class="skeleton skeleton-card"></div>}</div>
          <div class="skeleton skeleton-panel"></div>
          <span class="sr-only">Loading workspace data</span>
        </section>
      } @else if(data.hasError()){
        <section class="workspace-error" role="alert">
          <div class="eyebrow">DATA CONNECTION</div>
          <h1>We couldn't load the workspace.</h1>
          <p>{{data.errorMessage()}}</p>
          <div class="head-actions"><button class="primary" (click)="data.retry()">Retry</button><a class="secondary" routerLink="/app/settings">Open settings</a></div>
        </section>
      } @else {
        <router-outlet />
      }
    </main>
    <footer class="product-credit">Created by <a href="https://maqtastudio.com" target="_blank" rel="noreferrer">MAQTA STUDIO</a></footer>
  </section>
</div>`})
export class AppShellComponent{
  menuOpen=signal(false);theme=inject(ThemeService);readonly data=inject(BusinessDataService);private auth=inject(AuthService);private router=inject(Router);
  @HostListener('document:keydown',['$event']) onKeydown(event:KeyboardEvent){if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();this.openSearch();}if(event.key==='Escape')this.closeMenu();}
  openSearch(){this.router.navigateByUrl('/app/search');this.closeMenu();}
  closeMenu(){this.menuOpen.set(false)}
  logout(){this.auth.logout();this.router.navigateByUrl('/login');}
}

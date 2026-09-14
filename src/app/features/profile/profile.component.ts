import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({selector:'app-profile',standalone:true,imports:[RouterLink],template:`<div class="page-head"><div><div class="eyebrow">ACCOUNT</div><h1>Profile</h1><p>Your workspace identity and preferences.</p></div></div><article class="panel profile-card"><div class="avatar profile-avatar">MF</div><div><h2>Mina Farrow</h2><p class="muted">Operations Lead · RIVET</p><a class="secondary" routerLink="/app/settings">Account settings</a></div></article>`})export class ProfileComponent{}

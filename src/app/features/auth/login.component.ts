import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
@Component({selector:'app-login', standalone:true, imports:[ReactiveFormsModule], template:`
<div class="login-page">
  <section class="login-brand" aria-label="RIVET product introduction">
    <div class="brand-mark">R</div><div class="eyebrow">RIVET / OPERATIONS WORKSPACE</div>
    <h1>Run projects without losing the thread.</h1>
    <p>Projects, clients, resources and daily operations — one calm workspace for growing fit-out teams.</p>
    <div class="proof-row"><span>18 live projects</span><span>7 team members</span><span>4.8/5 client score</span></div>
  </section>
  <main class="login-panel">
    <div class="login-card">
      <div class="mini-brand">RIVET</div><h2>Welcome back</h2><p class="muted">Use the demo credentials below, or any valid-looking email and 6+ character password.</p>
      <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <label>Email<input type="email" formControlName="email" autocomplete="email"></label>
        <label>Password<input type="password" formControlName="password" autocomplete="current-password"></label>
        @if(error){<div class="form-error" role="alert">Please enter a valid email and a password with at least 6 characters.</div>}
        <button class="primary" type="submit">Enter workspace <span>→</span></button>
      </form>
      <div class="demo-note"><strong>Demo:</strong> hello@rivet.demo / rivet123</div>
      <p class="credit">Portfolio product by <a href="https://maqtastudio.com" target="_blank" rel="noreferrer">MAQTA STUDIO</a></p>
    </div>
  </main>
</div>`})
export class LoginComponent {
  private fb=inject(FormBuilder); private auth=inject(AuthService); private router=inject(Router); error=false;
  form=this.fb.nonNullable.group({email:['hello@rivet.demo',[Validators.required,Validators.email]],password:['rivet123',[Validators.required,Validators.minLength(6)]]});
  submit(){ if(this.form.invalid || !this.auth.login(this.form.controls.email.value,this.form.controls.password.value)){this.error=true; return;} this.router.navigateByUrl('/app/overview'); }
}

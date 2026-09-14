import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BusinessDataService } from '../../core/services/business-data.service';

@Component({selector:'app-customers',standalone:true,imports:[FormsModule,ReactiveFormsModule,RouterLink],template:`
<div class="page-head"><div><div class="eyebrow">CRM / CUSTOMERS</div><h1>Customers</h1><p>Relationships, active work and commercial history.</p></div><button class="primary" type="button" (click)="openCreate()">+ Add customer</button></div>
<div class="toolbar"><input [ngModel]="query()" (ngModelChange)="query.set($event)" placeholder="Search customer, contact or city" aria-label="Search customers"><select [ngModel]="status()" (ngModelChange)="status.set($event)" aria-label="Filter customers by status"><option value="All">All customers</option><option>Active</option><option>Lead</option><option>Dormant</option></select></div>
<article class="panel table-panel"><div class="table-scroll"><table><caption class="sr-only">Customer relationship records</caption><thead><tr><th scope="col">Customer</th><th scope="col">Contact</th><th scope="col">Status</th><th scope="col">Active work</th><th scope="col">Lifetime value</th><th scope="col">Last activity</th></tr></thead><tbody>
@for(c of filtered();track c.id){<tr><td><a [routerLink]="['/app/customers',c.id]" class="customer-cell"><span class="customer-monogram">{{c.initials}}</span><span><strong>{{c.name}}</strong><small>{{c.city}}</small></span></a></td><td><strong>{{c.contact}}</strong><small>{{c.email}}</small></td><td><span class="status" [attr.data-status]="c.status">{{c.status}}</span></td><td>{{c.activeProjects}} projects</td><td>{{money(c.lifetimeValue)}}</td><td>{{c.lastActivity}}</td></tr>} @empty {<tr><td colspan="6"><div class="empty-state"><strong>No customers found</strong><span>Try another name, contact or status.</span></div></td></tr>}
</tbody></table></div></article>
@if(showCreate()){
<div class="dialog-layer" (click)="closeCreate()"><section class="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="new-customer-title" (click)="$event.stopPropagation()">
<div class="dialog-head"><div><span class="panel-kicker">CRM</span><h2 id="new-customer-title">Add customer</h2></div><button type="button" class="icon-close" (click)="closeCreate()" aria-label="Close dialog">×</button></div>
<form class="product-form" [formGroup]="createForm" (ngSubmit)="createCustomer()">
<label class="wide">Company / customer name<input formControlName="name">@if(invalid('name')){<small class="error-text">Enter a customer name.</small>}</label>
<label>Primary contact<input formControlName="contact">@if(invalid('contact')){<small class="error-text">Enter a contact name.</small>}</label>
<label>Status<select formControlName="status"><option>Active</option><option>Lead</option><option>Dormant</option></select></label>
<label>Email<input type="email" formControlName="email">@if(invalid('email')){<small class="error-text">Enter a valid email.</small>}</label>
<label>Phone<input formControlName="phone">@if(invalid('phone')){<small class="error-text">Enter a phone number.</small>}</label>
<label class="wide">City<input formControlName="city">@if(invalid('city')){<small class="error-text">Enter a city.</small>}</label>
<div class="dialog-actions wide"><button class="secondary" type="button" (click)="closeCreate()">Cancel</button><button class="primary" type="submit">Add customer</button></div>
</form></section></div>}
`})
export class CustomersComponent{
  readonly data=inject(BusinessDataService); private readonly router=inject(Router); private readonly fb=inject(FormBuilder);
  readonly query=signal(''); readonly status=signal('All'); readonly showCreate=signal(false);
  readonly createForm=this.fb.nonNullable.group({name:['',[Validators.required,Validators.minLength(2)]],contact:['',Validators.required],email:['',[Validators.required,Validators.email]],phone:['',Validators.required],city:['',Validators.required],status:['Lead' as 'Active'|'Lead'|'Dormant',Validators.required]});
  readonly filtered=computed(()=>{const q=this.query().trim().toLowerCase();return this.data.customers().filter(c=>(this.status()==='All'||c.status===this.status())&&(!q||`${c.name} ${c.contact} ${c.city} ${c.email}`.toLowerCase().includes(q)));});
  money(value:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);}
  openCreate(){this.createForm.reset({name:'',contact:'',email:'',phone:'',city:'',status:'Lead'});this.showCreate.set(true)} closeCreate(){this.showCreate.set(false)}
  invalid(name:keyof typeof this.createForm.controls){const control=this.createForm.controls[name];return control.invalid&&(control.touched||control.dirty)}
  createCustomer(){if(this.createForm.invalid){this.createForm.markAllAsTouched();return;}const customer=this.data.createCustomer(this.createForm.getRawValue());this.closeCreate();void this.router.navigate(['/app/customers',customer.id]);}
}

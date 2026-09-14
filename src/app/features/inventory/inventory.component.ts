import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessDataService } from '../../core/services/business-data.service';
@Component({selector:'app-inventory',standalone:true,imports:[FormsModule,ReactiveFormsModule],template:`
<div class="page-head"><div><div class="eyebrow">RESOURCES / INVENTORY</div><h1>Inventory</h1><p>Materials and procurement signals across live projects.</p></div><button class="primary" type="button" (click)="openCreate()">+ Add item</button></div>
<section class="kpi-grid three"><article class="kpi-card"><span>Items tracked</span><strong>{{data.inventory().length}}</strong><small>Live mock catalogue</small></article><article class="kpi-card"><span>Needs action</span><strong>{{data.lowStockCount()}}</strong><small class="warning">Below threshold / unavailable</small></article><article class="kpi-card"><span>Stock value</span><strong>{{money(stockValue())}}</strong><small>Current on-hand estimate</small></article></section>
<div class="toolbar"><input [ngModel]="query()" (ngModelChange)="query.set($event)" placeholder="Search material, supplier or SKU" aria-label="Search inventory"><select [ngModel]="status()" (ngModelChange)="status.set($event)" aria-label="Filter inventory by stock status"><option value="All">All stock states</option><option>Healthy</option><option>Low stock</option><option>Ordered</option><option>Out of stock</option></select></div>
<article class="panel table-panel"><div class="table-scroll"><table><caption class="sr-only">Inventory and procurement items</caption><thead><tr><th scope="col">Material</th><th scope="col">Supplier</th><th scope="col">Status</th><th scope="col">Available</th><th scope="col">Reserved</th><th scope="col">Reorder at</th><th scope="col">Unit cost</th></tr></thead><tbody>
@for(i of filtered();track i.id){<tr><td><strong>{{i.name}}</strong><small>{{i.sku}} · {{i.category}}</small></td><td>{{i.supplier}}</td><td><span class="status" [attr.data-status]="i.status">{{i.status}}</span></td><td>{{i.inStock}} {{i.unit}}</td><td>{{i.reserved}}</td><td>{{i.reorderAt}}</td><td>{{money(i.unitCost)}}</td></tr>}@empty{<tr><td colspan="7"><div class="empty-state"><strong>No inventory matches these filters</strong><span>Clear your search or select another stock state.</span></div></td></tr>}
</tbody></table></div></article>
@if(showCreate()){
<div class="dialog-layer" (click)="closeCreate()"><section class="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="new-item-title" (click)="$event.stopPropagation()">
<div class="dialog-head"><div><span class="panel-kicker">PROCUREMENT</span><h2 id="new-item-title">Add inventory item</h2></div><button type="button" class="icon-close" (click)="closeCreate()" aria-label="Close dialog">×</button></div>
<form class="product-form" [formGroup]="createForm" (ngSubmit)="createItem()">
<label class="wide">Material name<input formControlName="name">@if(invalid('name')){<small class="error-text">Enter a material name.</small>}</label>
<label>Category<input formControlName="category">@if(invalid('category')){<small class="error-text">Category is required.</small>}</label><label>SKU<input formControlName="sku">@if(invalid('sku')){<small class="error-text">SKU is required.</small>}</label>
<label>Supplier<input formControlName="supplier">@if(invalid('supplier')){<small class="error-text">Supplier is required.</small>}</label><label>Unit<input formControlName="unit" placeholder="roll, sheet, pcs">@if(invalid('unit')){<small class="error-text">Unit is required.</small>}</label>
<label>In stock<input type="number" min="0" formControlName="inStock"></label><label>Reserved<input type="number" min="0" formControlName="reserved"></label><label>Reorder at<input type="number" min="0" formControlName="reorderAt"></label><label>Unit cost<input type="number" min="0" step="0.01" formControlName="unitCost"></label>
<div class="dialog-actions wide"><button class="secondary" type="button" (click)="closeCreate()">Cancel</button><button class="primary" type="submit">Add item</button></div>
</form></section></div>}
`})
export class InventoryComponent{
  readonly data=inject(BusinessDataService);private readonly fb=inject(FormBuilder);readonly query=signal('');readonly status=signal('All');readonly showCreate=signal(false);
  readonly createForm=this.fb.nonNullable.group({name:['',Validators.required],category:['',Validators.required],sku:['',Validators.required],supplier:['',Validators.required],inStock:[0,[Validators.required,Validators.min(0)]],reserved:[0,[Validators.required,Validators.min(0)]],reorderAt:[0,[Validators.required,Validators.min(0)]],unit:['pcs',Validators.required],unitCost:[0,[Validators.required,Validators.min(0)]]});
  readonly stockValue=computed(()=>this.data.inventory().reduce((sum,item)=>sum+(item.inStock*item.unitCost),0));readonly filtered=computed(()=>{const q=this.query().trim().toLowerCase();return this.data.inventory().filter(i=>(this.status()==='All'||i.status===this.status())&&(!q||`${i.name} ${i.supplier} ${i.sku} ${i.category}`.toLowerCase().includes(q)));});
  money(value:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value)}
  openCreate(){this.createForm.reset({name:'',category:'',sku:'',supplier:'',inStock:0,reserved:0,reorderAt:0,unit:'pcs',unitCost:0});this.showCreate.set(true)}closeCreate(){this.showCreate.set(false)}
  invalid(name:keyof typeof this.createForm.controls){const c=this.createForm.controls[name];return c.invalid&&(c.touched||c.dirty)}
  createItem(){if(this.createForm.invalid){this.createForm.markAllAsTouched();return;}this.data.createInventoryItem(this.createForm.getRawValue());this.closeCreate();this.status.set('All');this.query.set('');}
}

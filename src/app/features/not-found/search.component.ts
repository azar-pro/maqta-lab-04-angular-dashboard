import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BusinessDataService } from '../../core/services/business-data.service';
@Component({selector:'app-search',standalone:true,imports:[FormsModule,RouterLink],template:`
<div class="page-head"><div><div class="eyebrow">GLOBAL SEARCH</div><h1>Find anything.</h1><p>Projects, customers, tasks and materials across the workspace.</p></div></div>
<div class="search-page"><input autofocus [ngModel]="query()" (ngModelChange)="query.set($event)" placeholder="Try “Marlow”, “oak”, or “RV-2419”" aria-label="Global search">
@if(!query().trim()){<div class="panel empty-state"><strong>Start typing to search</strong><span>Results are grouped by projects, customers, tasks and inventory.</span></div>}@else if(total()===0){<div class="panel empty-state"><strong>No results for “{{query()}}”</strong><span>Check the spelling or try a broader term.</span></div>}@else{
<div class="search-results">
@if(projectResults().length){<section class="panel search-group"><span class="panel-kicker">PROJECTS</span>@for(p of projectResults();track p.id){<a [routerLink]="['/app/projects',p.id]"><span><strong>{{p.name}}</strong><small>{{p.client}} · {{p.id}}</small></span><b>→</b></a>}</section>}
@if(customerResults().length){<section class="panel search-group"><span class="panel-kicker">CUSTOMERS</span>@for(c of customerResults();track c.id){<a [routerLink]="['/app/customers',c.id]"><span><strong>{{c.name}}</strong><small>{{c.contact}} · {{c.city}}</small></span><b>→</b></a>}</section>}
@if(taskResults().length){<section class="panel search-group"><span class="panel-kicker">TASKS</span>@for(t of taskResults();track t.id){<a routerLink="/app/tasks"><span><strong>{{t.title}}</strong><small>{{t.project}} · {{t.priority}}</small></span><b>→</b></a>}</section>}
@if(inventoryResults().length){<section class="panel search-group"><span class="panel-kicker">INVENTORY</span>@for(i of inventoryResults();track i.id){<a routerLink="/app/inventory"><span><strong>{{i.name}}</strong><small>{{i.supplier}} · {{i.sku}}</small></span><b>→</b></a>}</section>}
</div>}
</div>`})
export class SearchComponent{readonly data=inject(BusinessDataService);readonly query=signal('');private match(value:string){return value.toLowerCase().includes(this.query().trim().toLowerCase())}readonly projectResults=computed(()=>this.query().trim()?this.data.projects().filter(p=>this.match(`${p.name} ${p.client} ${p.id} ${p.owner}`)).slice(0,5):[]);readonly customerResults=computed(()=>this.query().trim()?this.data.customers().filter(c=>this.match(`${c.name} ${c.contact} ${c.city} ${c.email}`)).slice(0,5):[]);readonly taskResults=computed(()=>this.query().trim()?this.data.tasks().filter(t=>this.match(`${t.title} ${t.project} ${t.assignee}`)).slice(0,5):[]);readonly inventoryResults=computed(()=>this.query().trim()?this.data.inventory().filter(i=>this.match(`${i.name} ${i.supplier} ${i.sku}`)).slice(0,5):[]);readonly total=computed(()=>this.projectResults().length+this.customerResults().length+this.taskResults().length+this.inventoryResults().length);}

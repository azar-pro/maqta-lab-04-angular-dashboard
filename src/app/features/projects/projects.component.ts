import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BusinessDataService } from '../../core/services/business-data.service';
import { ProjectStatus } from '../../core/models/business.models';

@Component({
  selector:'app-projects',
  standalone:true,
  imports:[FormsModule,ReactiveFormsModule,RouterLink],
  template:`
  <div class="page-head">
    <div><div class="eyebrow">WORK / PROJECTS</div><h1>Projects</h1><p>Track delivery, value, risks and client progress.</p></div>
    <button class="primary" type="button" (click)="openCreate()">+ New project</button>
  </div>
  <section class="summary-strip" aria-label="Project summary">
    <div><span>Open projects</span><strong>{{data.activeProjects()}}</strong></div>
    <div><span>Pipeline value</span><strong>{{money(data.pipelineValue())}}</strong></div>
    <div><span>At risk</span><strong>{{atRiskCount()}}</strong></div>
  </section>
  <div class="toolbar">
    <input [ngModel]="query()" (ngModelChange)="query.set($event)" placeholder="Search projects, clients or ID" aria-label="Search projects">
    <select [ngModel]="status()" (ngModelChange)="status.set($event)" aria-label="Filter project status">
      <option value="All">All statuses</option><option>In progress</option><option>Review</option><option>On hold</option><option>Completed</option>
    </select>
    <select [ngModel]="owner()" (ngModelChange)="owner.set($event)" aria-label="Filter project owner">
      <option value="All">All owners</option>@for(person of owners();track person){<option>{{person}}</option>}
    </select>
    <button class="secondary" type="button" (click)="clearFilters()">Clear</button>
  </div>
  <article class="panel table-panel">
    <div class="table-scroll"><table><caption class="sr-only">Projects workspace</caption>
      <thead><tr><th scope="col">Project</th><th scope="col">Client</th><th scope="col">Status</th><th scope="col">Progress</th><th scope="col">Owner</th><th scope="col">Due</th><th scope="col">Value</th></tr></thead>
      <tbody>
      @for(p of filtered();track p.id){
        <tr>
          <td><a [routerLink]="['/app/projects',p.id]"><strong>{{p.name}}</strong><small>{{p.id}}</small></a></td>
          <td>{{p.client}}</td><td><span class="status" [attr.data-status]="p.status">{{p.status}}</span></td>
          <td><div class="table-progress"><span [style.width.%]="p.progress"></span></div><small>{{p.progress}}%</small></td>
          <td>{{p.owner}}</td><td>{{p.due}}</td><td>{{money(p.value)}}</td>
        </tr>
      } @empty {
        <tr><td colspan="7"><div class="empty-state"><strong>No projects match these filters</strong><span>Clear one or more filters to restore the project list.</span><button class="secondary compact" type="button" (click)="clearFilters()">Reset filters</button></div></td></tr>
      }
      </tbody>
    </table></div>
  </article>

  @if(showCreate()){
    <div class="dialog-layer" (click)="closeCreate()">
      <section class="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="new-project-title" (click)="$event.stopPropagation()">
        <div class="dialog-head"><div><span class="panel-kicker">NEW WORK</span><h2 id="new-project-title">Create project</h2></div><button type="button" class="icon-close" (click)="closeCreate()" aria-label="Close dialog">×</button></div>
        <form class="product-form" [formGroup]="createForm" (ngSubmit)="createProject()">
          <label class="wide">Project name<input formControlName="name" autocomplete="off">@if(invalid('name')){<small class="error-text">Enter a project name.</small>}</label>
          <label>Customer<select formControlName="clientId"><option value="">Choose customer</option>@for(customer of data.customers();track customer.id){<option [value]="customer.id">{{customer.name}}</option>}</select>@if(invalid('clientId')){<small class="error-text">Choose a customer.</small>}</label>
          <label>Status<select formControlName="status"><option>In progress</option><option>Review</option><option>On hold</option><option>Completed</option></select></label>
          <label>Owner<input formControlName="owner" autocomplete="off">@if(invalid('owner')){<small class="error-text">Owner is required.</small>}</label>
          <label>Due date<input type="date" formControlName="dueIso">@if(invalid('dueIso')){<small class="error-text">Choose a due date.</small>}</label>
          <label>Project value<input type="number" min="0" step="100" formControlName="value">@if(invalid('value')){<small class="error-text">Use a value of 0 or more.</small>}</label>
          <label class="wide">Scope<textarea formControlName="scope" rows="4"></textarea>@if(invalid('scope')){<small class="error-text">Add a short project scope.</small>}</label>
          <div class="dialog-actions wide"><button class="secondary" type="button" (click)="closeCreate()">Cancel</button><button class="primary" type="submit">Create project</button></div>
        </form>
      </section>
    </div>
  }`
})
export class ProjectsComponent implements OnInit {
  readonly data = inject(BusinessDataService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  readonly query = signal('');
  readonly status = signal<'All' | ProjectStatus>('All');
  readonly owner = signal('All');
  readonly showCreate = signal(false);
  readonly createForm = this.fb.nonNullable.group({
    name:['', [Validators.required, Validators.minLength(3)]], clientId:['', Validators.required], status:['In progress' as ProjectStatus, Validators.required],
    owner:['Mina Farrow', Validators.required], dueIso:['', Validators.required], value:[0, [Validators.required, Validators.min(0)]], scope:['', [Validators.required, Validators.minLength(8)]]
  });
  readonly owners = computed(() => [...new Set(this.data.projects().map(project => project.owner))]);
  readonly atRiskCount = computed(() => this.data.projects().filter(project => !!project.risk && project.status !== 'Completed').length);
  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.data.projects().filter(project =>
      (this.status() === 'All' || project.status === this.status()) &&
      (this.owner() === 'All' || project.owner === this.owner()) &&
      (!q || `${project.name} ${project.client} ${project.id} ${project.owner}`.toLowerCase().includes(q))
    );
  });
  ngOnInit(){
    const shouldOpen=this.route.snapshot.queryParamMap.get('new')==='1';
    const clientId=this.route.snapshot.queryParamMap.get('client')??'';
    if(shouldOpen){this.openCreate();if(clientId&&this.data.customerById(clientId)){this.createForm.controls.clientId.setValue(clientId);}}
  }
  money(value:number){ return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value); }
  clearFilters(){ this.query.set(''); this.status.set('All'); this.owner.set('All'); }
  openCreate(){ this.createForm.reset({name:'',clientId:'',status:'In progress',owner:'Mina Farrow',dueIso:'',value:0,scope:''}); this.showCreate.set(true); }
  closeCreate(){ this.showCreate.set(false); }
  invalid(name:keyof typeof this.createForm.controls){ const control=this.createForm.controls[name]; return control.invalid && (control.touched || control.dirty); }
  createProject(){
    if(this.createForm.invalid){this.createForm.markAllAsTouched();return;}
    const project=this.data.createProject(this.createForm.getRawValue());
    this.closeCreate();
    void this.router.navigate(['/app/projects',project.id]);
  }
}

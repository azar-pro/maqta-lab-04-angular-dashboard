import { Component, Input, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BusinessDataService } from '../../core/services/business-data.service';
import { ProjectStatus } from '../../core/models/business.models';

@Component({selector:'app-project-detail',standalone:true,imports:[RouterLink,ReactiveFormsModule],template:`
@if(project(); as p){
  <a class="back-link" routerLink="/app/projects">← Projects</a>
  <div class="page-head"><div><div class="eyebrow">PROJECT / {{p.id}}</div><h1>{{p.name}}</h1><p>{{p.scope}}</p></div><div class="head-actions"><button class="secondary" type="button" (click)="shareUpdate()">{{copied()?'Update copied':'Share update'}}</button><button class="primary" type="button" (click)="openEdit()">Edit project</button></div></div>
  <section class="detail-grid">
    <article class="panel"><span class="panel-kicker">PROJECT HEALTH</span><div class="project-health-title"><h2>{{p.risk ? 'On track, with one dependency' : 'On track'}}</h2><span class="status" [attr.data-status]="p.status">{{p.status}}</span></div><div class="progress"><span [style.width.%]="p.progress"></span></div><div class="metrics-row"><div><small>Progress</small><strong>{{p.progress}}%</strong></div><div><small>Value</small><strong>{{money(p.value)}}</strong></div><div><small>Due</small><strong>{{p.due}}</strong></div></div></article>
    <article class="panel"><span class="panel-kicker">CLIENT & OWNER</span><h2>{{p.client}}</h2><p class="muted">Managed by {{p.owner}}.</p><a class="secondary inline-action" [routerLink]="['/app/customers',p.clientId]">Open customer</a></article>
  </section>
  <section class="detail-grid detail-lower">
    <article class="panel"><span class="panel-kicker">CURRENT RISK</span><h2>{{p.risk || 'No active project risks'}}</h2><p class="muted">Risk notes are kept visible at project level so operations can act before they affect delivery.</p></article>
    <article class="panel"><span class="panel-kicker">DELIVERY</span><h2>Next milestone</h2><p class="muted">Internal production check, client sign-off and procurement confirmation.</p><button class="secondary" type="button" (click)="openTasks()">Open task queue</button></article>
  </section>
  @if(showEdit()){
    <div class="dialog-layer" (click)="closeEdit()"><section class="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="edit-project-title" (click)="$event.stopPropagation()">
      <div class="dialog-head"><div><span class="panel-kicker">{{p.id}}</span><h2 id="edit-project-title">Edit project</h2></div><button type="button" class="icon-close" (click)="closeEdit()" aria-label="Close dialog">×</button></div>
      <form class="product-form" [formGroup]="editForm" (ngSubmit)="saveProject()">
        <label class="wide">Project name<input formControlName="name">@if(invalid('name')){<small class="error-text">Enter a project name.</small>}</label>
        <label>Status<select formControlName="status"><option>In progress</option><option>Review</option><option>On hold</option><option>Completed</option></select></label>
        <label>Progress<input type="number" min="0" max="100" formControlName="progress">@if(invalid('progress')){<small class="error-text">Progress must be 0–100.</small>}</label>
        <label>Owner<input formControlName="owner">@if(invalid('owner')){<small class="error-text">Owner is required.</small>}</label>
        <label>Due date<input type="date" formControlName="dueIso">@if(invalid('dueIso')){<small class="error-text">Choose a due date.</small>}</label>
        <label>Project value<input type="number" min="0" step="100" formControlName="value">@if(invalid('value')){<small class="error-text">Use a value of 0 or more.</small>}</label>
        <label class="wide">Scope<textarea rows="3" formControlName="scope"></textarea></label>
        <label class="wide">Risk note <span class="optional">Optional</span><textarea rows="3" formControlName="risk"></textarea></label>
        <div class="dialog-actions wide"><button class="secondary" type="button" (click)="closeEdit()">Cancel</button><button class="primary" type="submit">Save project</button></div>
      </form>
    </section></div>
  }
} @else {
  <div class="state-panel"><span>404 / PROJECT</span><h1>Project not found.</h1><p>This project ID does not exist in the current workspace.</p><a class="primary" routerLink="/app/projects">Return to projects</a></div>
}`})
export class ProjectDetailComponent{
  private readonly data=inject(BusinessDataService);private readonly router=inject(Router);private readonly fb=inject(FormBuilder);private readonly projectId=signal('');
  readonly showEdit=signal(false);readonly copied=signal(false);
  readonly editForm=this.fb.nonNullable.group({name:['',[Validators.required,Validators.minLength(3)]],status:['In progress' as ProjectStatus,Validators.required],progress:[0,[Validators.required,Validators.min(0),Validators.max(100)]],owner:['',Validators.required],dueIso:['',Validators.required],value:[0,[Validators.required,Validators.min(0)]],scope:['',Validators.required],risk:['']});
  @Input() set id(value:string){ this.projectId.set(value); }
  readonly project=computed(()=>this.data.projectById(this.projectId()));
  money(value:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);}
  openEdit(){const p=this.project();if(!p)return;this.editForm.reset({name:p.name,status:p.status,progress:p.progress,owner:p.owner,dueIso:p.dueIso,value:p.value,scope:p.scope,risk:p.risk??''});this.showEdit.set(true)} closeEdit(){this.showEdit.set(false)}
  invalid(name:keyof typeof this.editForm.controls){const control=this.editForm.controls[name];return control.invalid&&(control.touched||control.dirty)}
  saveProject(){if(this.editForm.invalid){this.editForm.markAllAsTouched();return;}this.data.updateProject(this.projectId(),this.editForm.getRawValue());this.closeEdit();}
  async shareUpdate(){const p=this.project();if(!p)return;const text=`${p.name} — ${p.status} — ${p.progress}% complete — due ${p.due}. ${p.risk?`Current risk: ${p.risk}`:'No active risks.'}`;try{await navigator.clipboard.writeText(text);this.copied.set(true);window.setTimeout(()=>this.copied.set(false),1800);}catch{this.copied.set(false)}}
  openTasks(){void this.router.navigate(['/app/tasks']);}
}

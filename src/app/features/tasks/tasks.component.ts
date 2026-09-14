import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessDataService } from '../../core/services/business-data.service';
import { Priority } from '../../core/models/business.models';
@Component({selector:'app-tasks',standalone:true,imports:[FormsModule,ReactiveFormsModule],template:`
<div class="page-head"><div><div class="eyebrow">WORK / TASKS</div><h1>Tasks</h1><p>A focused queue across every active project.</p></div><button class="primary" type="button" (click)="openCreate()">+ New task</button></div>
<div class="task-tabs" role="tablist" aria-label="Task views"><button role="tab" [attr.aria-selected]="view()==='Open'" [class.active]="view()==='Open'" (click)="view.set('Open')">Open <span>{{openCount()}}</span></button><button role="tab" [attr.aria-selected]="view()==='Completed'" [class.active]="view()==='Completed'" (click)="view.set('Completed')">Completed</button><button role="tab" [attr.aria-selected]="view()==='All'" [class.active]="view()==='All'" (click)="view.set('All')">All</button></div>
<div class="toolbar"><input [ngModel]="query()" (ngModelChange)="query.set($event)" placeholder="Search tasks or projects" aria-label="Search tasks"><select [ngModel]="priority()" (ngModelChange)="priority.set($event)" aria-label="Filter tasks by priority"><option value="All">All priorities</option><option>High</option><option>Medium</option><option>Low</option></select></div>
<article class="panel task-board">@for(t of filtered();track t.id){<div class="task-row" [class.is-complete]="t.completed"><button class="check" [class.checked]="t.completed" (click)="data.toggleTask(t.id)" [attr.aria-label]="t.completed?'Reopen task':'Mark task complete'">{{t.completed?'✓':''}}</button><div><strong>{{t.title}}</strong><span>{{t.project}} · {{t.assignee}}</span><small>{{t.when}}</small></div><em [attr.data-priority]="t.priority">{{t.priority}}</em></div>}@empty{<div class="empty-state"><strong>Nothing in this queue</strong><span>Your selected task filters returned no results.</span></div>}</article>
@if(showCreate()){
<div class="dialog-layer" (click)="closeCreate()"><section class="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="new-task-title" (click)="$event.stopPropagation()">
<div class="dialog-head"><div><span class="panel-kicker">TASK QUEUE</span><h2 id="new-task-title">Create task</h2></div><button type="button" class="icon-close" (click)="closeCreate()" aria-label="Close dialog">×</button></div>
<form class="product-form" [formGroup]="createForm" (ngSubmit)="createTask()">
<label class="wide">Task title<input formControlName="title">@if(invalid('title')){<small class="error-text">Enter a task title.</small>}</label>
<label>Project<select formControlName="projectId"><option value="">Choose project</option>@for(project of activeProjectOptions();track project.id){<option [value]="project.id">{{project.name}}</option>}</select>@if(invalid('projectId')){<small class="error-text">Choose a project.</small>}</label>
<label>Priority<select formControlName="priority"><option>High</option><option>Medium</option><option>Low</option></select></label>
<label>Assignee<input formControlName="assignee">@if(invalid('assignee')){<small class="error-text">Assignee is required.</small>}</label>
<label>Due date<input type="date" formControlName="dueIso">@if(invalid('dueIso')){<small class="error-text">Choose a due date.</small>}</label>
<div class="dialog-actions wide"><button class="secondary" type="button" (click)="closeCreate()">Cancel</button><button class="primary" type="submit">Create task</button></div>
</form></section></div>}
`})
export class TasksComponent{
  readonly data=inject(BusinessDataService);private readonly fb=inject(FormBuilder);
  readonly query=signal('');readonly priority=signal('All');readonly view=signal<'Open'|'Completed'|'All'>('Open');readonly showCreate=signal(false);
  readonly createForm=this.fb.nonNullable.group({title:['',[Validators.required,Validators.minLength(3)]],projectId:['',Validators.required],priority:['Medium' as Priority,Validators.required],assignee:['Mina Farrow',Validators.required],dueIso:['',Validators.required]});
  readonly openCount=computed(()=>this.data.tasks().filter(t=>!t.completed).length);readonly activeProjectOptions=computed(()=>this.data.projects().filter(project=>project.status!=='Completed'));
  readonly filtered=computed(()=>{const q=this.query().trim().toLowerCase();return this.data.tasks().filter(t=>(this.view()==='All'||(this.view()==='Open'&&!t.completed)||(this.view()==='Completed'&&t.completed))&&(this.priority()==='All'||t.priority===this.priority())&&(!q||`${t.title} ${t.project} ${t.assignee}`.toLowerCase().includes(q)));});
  openCreate(){this.createForm.reset({title:'',projectId:'',priority:'Medium',assignee:'Mina Farrow',dueIso:''});this.showCreate.set(true)} closeCreate(){this.showCreate.set(false)}
  invalid(name:keyof typeof this.createForm.controls){const control=this.createForm.controls[name];return control.invalid&&(control.touched||control.dirty)}
  createTask(){if(this.createForm.invalid){this.createForm.markAllAsTouched();return;}this.data.createTask(this.createForm.getRawValue());this.closeCreate();this.view.set('Open');this.priority.set('All');this.query.set('');}
}

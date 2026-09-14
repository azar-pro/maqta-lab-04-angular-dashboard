import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BusinessDataService } from '../../core/services/business-data.service';
import { RevenueChartComponent } from './revenue-chart.component';
@Component({selector:'app-overview',standalone:true,imports:[RouterLink,RevenueChartComponent],template:`
<div class="page-head"><div><div class="eyebrow">MONDAY, 14 SEPTEMBER</div><h1>Good morning, Mina.</h1><p>{{riskProjects().length}} projects need attention before the end of the week.</p></div><div class="head-actions"><button class="secondary" type="button" (click)="exportReport()">Export report</button><a class="primary" routerLink="/app/projects" [queryParams]="{new:1}">+ New project</a></div></div>
<section class="kpi-grid">
  <article class="kpi-card"><span>Active projects</span><strong>{{data.activeProjects()}}</strong><small>Across {{data.customers().length}} customers</small></article>
  <article class="kpi-card"><span>Revenue</span><strong>$84.6k</strong><small>+12.4% vs last month</small></article>
  <article class="kpi-card"><span>Pipeline value</span><strong>{{compactMoney(data.pipelineValue())}}</strong><small>Open delivery value</small></article>
  <article class="kpi-card"><span>At risk</span><strong>{{riskProjects().length}}</strong><small class="warning">Needs review</small></article>
</section>
<section class="dashboard-grid">
  <article class="panel revenue"><div class="panel-head"><div><span class="panel-kicker">REVENUE</span><h2>$84,600</h2></div><select aria-label="Revenue period"><option>Last 6 months</option><option>This year</option></select></div><app-revenue-chart /></article>
  <article class="panel attention"><div class="panel-head"><div><span class="panel-kicker">ATTENTION</span><h2>Needs review</h2></div><span class="risk-dot">{{riskProjects().length}}</span></div><div class="attention-list">@for(p of riskProjects();track p.id){<div><strong>{{p.name}}</strong><span>{{p.risk}}</span></div>}</div><a routerLink="/app/projects">Review project risks →</a></article>
</section>
<section class="split-grid">
  <article class="panel table-panel"><div class="section-title"><div><span class="panel-kicker">PROJECTS</span><h2>Current pipeline</h2></div><a routerLink="/app/projects">View all →</a></div><div class="table-scroll"><table><caption class="sr-only">Current project pipeline</caption><thead><tr><th scope="col">Project</th><th scope="col">Client</th><th scope="col">Status</th><th scope="col">Due</th><th scope="col">Value</th></tr></thead><tbody>@for(p of currentProjects();track p.id){<tr><td><a [routerLink]="['/app/projects',p.id]"><strong>{{p.name}}</strong><small>{{p.id}}</small></a></td><td>{{p.client}}</td><td><span class="status" [attr.data-status]="p.status">{{p.status}}</span></td><td>{{p.due}}</td><td>{{money(p.value)}}</td></tr>}</tbody></table></div></article>
  <article class="panel task-panel"><div class="section-title"><div><span class="panel-kicker">TASKS</span><h2>Next up</h2></div><a routerLink="/app/tasks">All tasks →</a></div>@for(t of openTasks();track t.id){<div class="task-row"><button class="check" (click)="data.toggleTask(t.id)" aria-label="Mark task complete"></button><div><strong>{{t.title}}</strong><span>{{t.project}}</span><small>{{t.when}}</small></div><em [attr.data-priority]="t.priority">{{t.priority}}</em></div>}</article>
</section>`})
export class OverviewComponent{
  readonly data=inject(BusinessDataService);readonly riskProjects=computed(()=>this.data.projects().filter(p=>!!p.risk&&p.status!=='Completed').slice(0,3));readonly currentProjects=computed(()=>this.data.projects().slice(0,5));readonly openTasks=computed(()=>this.data.tasks().filter(t=>!t.completed).slice(0,4));
  money(v:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(v)}compactMoney(v:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',notation:'compact',maximumFractionDigits:1}).format(v)}
  exportReport(){const rows=[['Project ID','Project','Client','Status','Progress','Due','Value','Owner'],...this.data.projects().map(p=>[p.id,p.name,p.client,p.status,`${p.progress}%`,p.due,String(p.value),p.owner])];const csv=rows.map(row=>row.map(cell=>`"${String(cell).replaceAll('"','""')}"`).join(',')).join('\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='rivet-project-report.csv';a.click();URL.revokeObjectURL(url);}
}

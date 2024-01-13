import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TechnotesComponent } from './technotes/technotes.component';
import { SysteminfoComponent } from './systeminfo/systeminfo.component';

import { SitepartsComponent } from './siteparts/siteparts.component';

import { SitenotesComponent } from './sitenotes/sitenotes.component';
import { DeleteSitenoteComponent } from './sitenotes/delete-sitenote/delete-sitenote.component';
import { SummarySitenoteComponent } from './sitenotes/summary-sitenote/summary-sitenote.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'technotes', component: TechnotesComponent, data: { title: 'Tech Notes' } },
      { path: 'systeminfo', component: SysteminfoComponent, data: { title: 'Site Info' } },
      { path: 'sitenote', component: SitenotesComponent, data: { title: 'Site Note' } },
      { path: 'sitenote/delete/:id', component: DeleteSitenoteComponent },
      { path: 'sitenote/summary', component: SummarySitenoteComponent },
      /* --------next to do ---------- */
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechRoutingModule { }

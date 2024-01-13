import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MtxGridModule } from '@ng-matero/extensions/grid';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { TechRoutingModule } from './tech-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomFormsModule } from 'ngx-custom-validators';
import { AppMaterialModule } from '../app-material/app-material.module';

import { TechnotesComponent } from './technotes/technotes.component';

import { SysteminfoComponent } from './systeminfo/systeminfo.component';

import { SitepartsComponent } from './siteparts/siteparts.component';

import { SitenotesComponent } from './sitenotes/sitenotes.component';
import { DeleteSitenoteComponent } from './sitenotes/delete-sitenote/delete-sitenote.component';
import { SummarySitenoteComponent } from './sitenotes/summary-sitenote/summary-sitenote.component';

import { SystemSummaryComponent } from './system-summary/system-summary.component';
import { SystemCctvComponent } from './system-cctv/system-cctv.component';
import { SystemAccessComponent } from './system-access/system-access.component';
import { SystemBurglaryComponent } from './system-burglary/system-burglary.component';
import { SystemIntercomComponent } from './system-intercom/system-intercom.component';
import { SystemNetworkComponent } from './system-network/system-network.component';
import { SystemOtherComponent } from './system-other/system-other.component';

import { CctvSummaryComponent } from './system-cctv/cctv-summary/cctv-summary.component';

import { AccessSummaryComponent } from './system-access/access-summary/access-summary.component';

import { NetworkSummaryComponent } from './system-network/network-summary/network-summary.component';
import { NetworkDevicesComponent } from './system-network/network-devices/network-devices.component';

import { IntercomSummaryComponent } from './system-intercom/intercom-summary/intercom-summary.component';
import { IntercomDevicesComponent } from './system-intercom/intercom-devices/intercom-devices.component';

import { BurglarySummaryComponent } from './system-burglary/burglary-summary/burglary-summary.component';
import { BurglaryZonesComponent } from './system-burglary/burglary-zones/burglary-zones.component';
import { BurglaryPanelsComponent } from './system-burglary/burglary-panels/burglary-panels.component';
import { SysServersComponent } from './sys-servers/sys-servers.component';
import { SysDevicesComponent } from './sys-devices/sys-devices.component';
import { SysLicensesComponent } from './sys-licenses/sys-licenses.component';
import { AddEditSysServerComponent } from './sys-servers/add-edit-sys-server/add-edit-sys-server.component';
import { DeleteSysServerComponent } from './sys-servers/delete-sys-server/delete-sys-server.component';
import { AddEditSysDeviceComponent } from './sys-devices/add-edit-sys-device/add-edit-sys-device.component';
import { DeleteSysDeviceComponent } from './sys-devices/delete-sys-device/delete-sys-device.component';
import { AddEditSysLicenseComponent } from './sys-licenses/add-edit-sys-license/add-edit-sys-license.component';
import { DeleteSysLicenseComponent } from './sys-licenses/delete-sys-license/delete-sys-license.component';
import { SysRemoteAccessComponent } from './sys-remote-access/sys-remote-access.component';
import { AddEditSysRemoteAccessComponent } from './sys-remote-access/add-edit-sys-remote-access/add-edit-sys-remote-access.component';
import { DeleteSysRemoteAccessComponent } from './sys-remote-access/delete-sys-remote-access/delete-sys-remote-access.component';
import { SummarySysRemoteAccessComponent } from './sys-remote-access/summary-sys-remote-access/summary-sys-remote-access.component';
import { SummarySysLicenseComponent } from './sys-licenses/summary-sys-license/summary-sys-license.component';
import { AddEditSitenoteComponent } from './sitenotes/add-edit-sitenote/add-edit-sitenote.component';
import { SysDoorsComponent } from './sys-doors/sys-doors.component';
import { SysZonesComponent } from './sys-zones/sys-zones.component';
import { AddEditSysZonesComponent } from './sys-zones/add-edit-sys-zones/add-edit-sys-zones.component';
import { DeleteSysZonesComponent } from './sys-zones/delete-sys-zones/delete-sys-zones.component';
import { DeleteSysDoorComponent } from './sys-doors/delete-sys-door/delete-sys-door.component';
import { AddEditSysDoorComponent } from './sys-doors/add-edit-sys-door/add-edit-sys-door.component';

import { QuillModule } from 'ngx-quill';
import { PipeModule } from 'app/shared/pipes/pipe.module';
import {RxReactiveFormsModule} from '@rxweb/reactive-form-validators';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({

  imports: [
    CommonModule,
    TechRoutingModule,
    NgbModule,
    NgxMaskModule.forRoot(maskConfig),
    CustomFormsModule,
    AppMaterialModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    MtxGridModule,
    QuillModule,
    PipeModule,
    RxReactiveFormsModule
  ],
  declarations: [
    TechnotesComponent,
    SysteminfoComponent,
    SitepartsComponent,
    SitenotesComponent,
    DeleteSitenoteComponent,
    SummarySitenoteComponent,
    SystemSummaryComponent,
    SystemCctvComponent,
    SystemAccessComponent,
    SystemBurglaryComponent,
    SystemIntercomComponent,
    SystemNetworkComponent,
    SystemOtherComponent,
    NetworkDevicesComponent,
    NetworkSummaryComponent,
    AccessSummaryComponent,
    CctvSummaryComponent,
    IntercomSummaryComponent,
    IntercomDevicesComponent,
    BurglarySummaryComponent,
    BurglaryZonesComponent,
    BurglaryPanelsComponent,
    SysServersComponent,
    SysDevicesComponent,
    SysLicensesComponent,
    AddEditSysServerComponent,
    DeleteSysServerComponent,
    AddEditSysDeviceComponent,
    DeleteSysDeviceComponent,
    AddEditSysLicenseComponent,
    DeleteSysLicenseComponent,
    SysRemoteAccessComponent,
    AddEditSysRemoteAccessComponent,
    DeleteSysRemoteAccessComponent,
    SummarySysRemoteAccessComponent,
    SummarySysLicenseComponent,
    AddEditSitenoteComponent,
    SysDoorsComponent,
    SysZonesComponent,
    AddEditSysZonesComponent,
    DeleteSysZonesComponent,
    DeleteSysDoorComponent,
    AddEditSysDoorComponent,
  ],
  exports: [],
  providers: [],
  entryComponents: []
})
export class TechModule { }

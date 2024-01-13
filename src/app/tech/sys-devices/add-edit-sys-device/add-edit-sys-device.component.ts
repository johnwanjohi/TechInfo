import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { SysDevicesComponent } from '../sys-devices.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {_macRegex, AccountsService, urlRegex} from 'app/shared/services/accounts.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormcontrolsService } from 'app/shared/services/formcontrols.service';
import { Component, Inject, OnInit, Optional, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import {RxwebValidators} from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-add-edit-sys-device',
  templateUrl: './add-edit-sys-device.component.html',
  styleUrls: ['./add-edit-sys-device.component.scss']
})

export class AddEditSysDeviceComponent implements OnInit {
  id: any;
  action: any;
  myForm: FormGroup;
  brand_id: any;
  product_id: any;
  listOfBrands: any[];
  listOfProducts: any[];
  brands$: Observable<any>;
  products$: Observable<any>;
  selected_brand: number;
  selected_product_id: number;
  selected_system_type: string;
  current_system_type: any;
  current_brand_id: number;
  current_product_id: number;
  current_system_site_id: any;
  current_system_device_id: any;
  currentUserName: string;
  listOfDeviceTypes: any[];
  listOfSubnetMask: any[];

  constructor(
    private AC: AccountsService,
    public formService: FormcontrolsService,
    public dialogRef: MatDialogRef<SysDevicesComponent>,
    private readonly changeDetectorRef: ChangeDetectorRef,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
    this.action = data.action;
    this.AC.loggedInUser.subscribe((userDetails) => {
      this.currentUserName = userDetails.username;
    });
    this.initializeForm();
  }

  public macPattern = new RegExp(/^[a-fA-F0-9]{2}(?:[:-]?[a-fA-F0-9]{2}){5}(?:,[a-fA-F0-9]{2}(?:[:-]?[a-fA-F0-9]{2}){5})*$/);

  ngOnInit(): void {
    this.initializeForm();
    this.loadListOfSubnetMask();
    this.AC.systemDeviceObserver().subscribe((systemdevice_id) => {
      this.current_system_device_id = systemdevice_id;
    });
    this.getBrands();
    this.getProducts();
    this.getSystemTypes();
    this.loadListOfDeviceTypes(this.current_system_type);
    this.id = this.data.id;
    this.myForm.patchValue({
      system_type: this.current_system_type,
    });
    this.AC.systeminfoSiteObserver().subscribe((system_site_id) => {
      this.current_system_site_id = Number(system_site_id);
      this.myForm.patchValue({
        site_id: Number(this.current_system_site_id)
      });
    });
    if (this.action === 'edit') {
      this.loadSysDeviceByID();
    }
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  initializeForm() {
    this.myForm = new FormGroup({
      id: new FormControl(0),
      site_id: new FormControl(0, Validators.required),
      system_type: new FormControl('', Validators.required),
      brand_id: new FormControl('', Validators.required),
      device_type: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      product_id: new FormControl('', Validators.required),
      serial_number: new FormControl(''),
      // nic_mac: new FormControl('', [Validators.pattern(this.macPattern)]),
      // nic_mac: new FormControl('' , [Validators.pattern(_macRegex)]),
      nic_mac: new FormControl('',
        [RxwebValidators.mask({mask:'**:**:**:**:**:**',valueWithMask:true })
        ,RxwebValidators.mac()]),
      nic_ip: new FormControl('',[
        RxwebValidators.ip()
      ]),
      nic_subnet: new FormControl(''),
      nic_gateway: new FormControl(''),
      nic_port: new FormControl(''),
      local_web_port: new FormControl(0),
      remote_ip: new FormControl(''),
      remote_web_port: new FormControl(0),
      username: new FormControl(''),
      password: new FormControl(''),
      firmware_version: new FormControl(''),
      link_name: new FormControl(''),
      link_password: new FormControl(''),
      location: new FormControl(''),
      notes: new FormControl('')
    });
    this.myForm.markAllAsTouched();
  }

  async loadSysDeviceByID() {
    this.id = this.data.id || this.current_system_device_id;
    const params = {
      action: 'getSysDeviceByID',
      module: 'system_devices',
      id: this.id,
    };
    this.AC.get(params).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          id: Number(answer.system_devices.id),
          site_id: Number(answer.system_devices.site_id),
          system_type: answer.system_devices.system_type,
          brand_id: Number(answer.system_devices.brand_id),
          device_type: answer.system_devices.device_type,
          name: answer.system_devices.name,
          product_id: Number(answer.system_devices.product_id),
          serial_number: answer.system_devices.serial_number,
          nic_mac: answer.system_devices.nic_mac,
          nic_ip: answer.system_devices.nic_ip,
          nic_subnet: answer.system_devices.nic_subnet,
          nic_gateway: answer.system_devices.nic_gateway,
          nic_port: answer.system_devices.nic_port,
          local_web_port: Number(answer.system_devices.local_web_port),
          remote_ip: answer.system_devices.remote_ip,
          remote_web_port: Number(answer.system_devices.remote_web_port),
          username: answer.system_devices.username,
          password: answer.system_devices.password,
          firmware_version: answer.system_devices.firmware_version,
          link_name: answer.system_devices.link_name,
          link_password: answer.system_devices.link_password,
          location: answer.system_devices.location,
          notes: answer.system_devices.notes,
        });
      this.changeDetectorRef.detectChanges();
      this.selected_brand = Number(answer.system_devices.brand_id);
      this.selected_product_id = Number(answer.system_devices.product_id);
      this.selected_system_type = answer.system_devices.system_type;
    });
  }

  async getBrands() {
    const params = {
      id: this.id,
    };
    const endpoint= 'brands/getAll' ;
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.listOfBrands = answer.brands.map((arr) => {
        arr.id = Number(arr.id);
        return arr;
      });
    });
    this.brands$ = await this.AC.get(params);
    this.brands$.subscribe((answer) => {
    });
  }

  async getProducts() {
    const params = {
      //action: 'getAll',
      //module: 'products'
    };
    const endpoint=  'products/getAll';
    await this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.listOfProducts = answer?.products?.map((arr) => {
        arr.id = Number(arr.id);
        arr.partnumber = arr.partnumber;
        return arr;
      });
      this.changeDetectorRef.detectChanges();
    });
    this.products$ = await this.AC.get(params);
    this.products$.subscribe((answer) => {
    });
  }

  async getSystemTypes() {
    this.AC.systemType.pipe(
      distinctUntilChanged()
    ).subscribe(system_type => {
      this.current_system_type = system_type;
    });
  }

  convertToJSON(product: any) {
    return JSON.parse(product);
  }

  Submit() {
    this.myForm.markAllAsTouched();
    if (this.action.toLowerCase() === 'add') {
      this.myForm.patchValue({
        link_name: 'N/A',
        link_password: 'N/A'
      });
    }
    if (this.action.toLowerCase() === 'edit') {
      this.myForm.removeControl('site_id');
      this.myForm.patchValue({
        id: this.data.id,
      });
    }
    const params = {
      //action: this.action.toLowerCase() === 'add' ? 'put' : 'post',
      //module: 'system_devices',
      form: this.myForm.value,
    };
    const endpoint= this.action.toLowerCase() === 'add' ? 'system_devices/put' : 'system_devices/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.action.toLowerCase() === 'add' ?
        this.AC.setNewSystemDevice(answer.system_devices) :
        this.AC.setUpdatedSystemDevice(answer.system_devices);
      this.closeDialog();
    });
  }

  loadListOfDeviceTypes(system_type) {
    switch (system_type) {
      case 'CCTV':
        this.listOfDeviceTypes = [
          { Id: 1, devicetype: 'Camera' },
          { Id: 2, devicetype: 'Speaker' },
          { Id: 3, devicetype: 'Encoder' },
        ];
        break;
      case 'ACCESS':
        this.listOfDeviceTypes = [
          { Id: 1, devicetype: 'Panel' },
          { Id: 2, devicetype: 'Subpanel' },
        ];
        break;
      case 'NETWORK':
        this.listOfDeviceTypes = [
          { Id: 1, devicetype: 'Antenna' },
          { Id: 1, devicetype: 'Bridge' },
          { Id: 2, devicetype: 'Gateway' },
          { Id: 3, devicetype: 'Modem' },
          { Id: 4, devicetype: 'Router' },
          { Id: 5, devicetype: 'Switch' },
          { Id: 6, devicetype: 'WAP' },
        ];
        break;

      default:
        console.log("NO SYSTEM Selected");
        break;
    }
    return this.listOfDeviceTypes;
  }

  loadListOfSubnetMask() {
    this.listOfSubnetMask = [
      { Id: '1', subnetmask: '255.255.255.252 (/30)' },
      { Id: '2', subnetmask: '255.255.255.248 (/29)' },
      { Id: '3', subnetmask: '255.255.255.240 (/28)' },
      { Id: '4', subnetmask: '255.255.255.224 (/27)' },
      { Id: '5', subnetmask: '255.255.255.192 (/26)' },
      { Id: '6', subnetmask: '255.255.255.128 (/25)' },
      { Id: '7', subnetmask: '255.255.255.0 (/24)' },
      { Id: '8', subnetmask: '255.255.254.0 (/23)' },
      { Id: '9', subnetmask: '255.255.252.0 (/22)' },
      { Id: '10', subnetmask: '255.255.248.0 (/21)' },
      { Id: '11', subnetmask: '255.255.240.0 (/20)' },
      { Id: '12', subnetmask: '255.255.224.0 (/19)' },
      { Id: '13', subnetmask: '255.255.192.0 (/18)' },
      { Id: '14', subnetmask: '255.255.128.0 (/17)' },
      { Id: '15', subnetmask: '255.255.0.0 (/16)' },
      { Id: '16', subnetmask: '255.254.0.0 (/15)' },
      { Id: '17', subnetmask: '255.252.0.0 (/14)' },
      { Id: '18', subnetmask: '255.248.0.0 (/13)' },
      { Id: '19', subnetmask: '255.240.0.0 (/12)' },
      { Id: '20', subnetmask: '255.224.0.0 (/11)' },
      { Id: '21', subnetmask: '255.192.0.0 (/10)' },
      { Id: '22', subnetmask: '255.128.0.0 (/9)' },
      { Id: '23', subnetmask: '255.0.0.0 (/8)' },
    ]
  }

  get displayFormErrors() {
    return this.formService.findInvalidControls(this.myForm);
  }

  Cancel() {
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}


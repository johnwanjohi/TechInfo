import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { SysServersComponent } from '../sys-servers.component';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormcontrolsService } from 'app/shared/services/formcontrols.service';
import {_macRegex, AccountsService} from 'app/shared/services/accounts.service';
import { Component, Inject, OnInit, Optional, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import {FunctionsService} from '../../../shared/services/functions.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-add-edit-sys-server',
  templateUrl: './add-edit-sys-server.component.html',
  styleUrls: ['./add-edit-sys-server.component.scss']
})

export class AddEditSysServerComponent implements OnInit, AfterViewChecked {
  id: any;
  action: any;
  myForm: FormGroup;
  brand_id: any;
  product_id: any;
  listOfBrands: any[]
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
  current_system_server_id: any;
  currentUserName: string;
  listOfServerTypes: any[];
  listOfSubnetMask: any[];
  _macRegex: any = _macRegex;

  constructor(
    private AC: AccountsService,
    public formService: FormcontrolsService,
    public dialogRef: MatDialogRef<SysServersComponent>,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private functionsService: FunctionsService,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.id = this.data.id;
    this.action = data.action;
    this.AC.loggedInUser.subscribe((userDetails) => {
      this.currentUserName = userDetails.username;
    });
    this.initializeForm();
  }

  // public macPattern = new RegExp(/^[a-fA-F0-9]{2}(?:[:-]?[a-fA-F0-9]{2}){5}(?:,[a-fA-F0-9]{2}(?:[:-]?[a-fA-F0-9]{2}){5})*$/);

  ngOnInit(): void {
    this.initializeForm();
    this.loadListOfSubnetMask();
    this.AC.systemServerObserver().subscribe((systemserver_id) => {
      this.current_system_server_id = systemserver_id;
    });
    this.getBrands();
    this.getProducts();
    this.getSystemTypes();
    this.loadListOfServerTypes(this.current_system_type);
    this.id = this.data.id;
    this.myForm.patchValue({
      system_type: this.current_system_type
    });
    this.AC.systeminfoSiteObserver().subscribe((system_site_id) => {
      this.current_system_site_id = Number(system_site_id);
      this.myForm.patchValue({
        site_id: Number(this.current_system_site_id)
      });
    });
    if (this.action === 'edit') {
      this.loadSysServerByID();
    }
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  initializeForm() {
    /*
    * this.macAddressInfoFormGroup = this.formBuilder.group({
            systemMacAddress:['', RxwebValidators.mac()],
        });
        * */
    const ipPattern =
      "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
    this.myForm = new FormGroup({
      id: new FormControl(0),
      site_id: new FormControl(0, Validators.required),
      system_type: new FormControl('', Validators.required),
      brand_id: new FormControl('', Validators.required),
      server_type: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      product_id: new FormControl('', Validators.required),
      serial_number: new FormControl(''),
      service_tag: new FormControl('N/A'),
      // nic0_mac: new FormControl('', [Validators.pattern(this.macPattern)]),
      nic0_mac: new FormControl('',
        [RxwebValidators.mask({mask:'**:**:**:**:**:**',valueWithMask:true }),RxwebValidators.mac()]),
      nic0_ip: new FormControl('' ,[
        RxwebValidators.ip()
        ]),
      nic0_subnet: new FormControl(''),
      nic0_gateway: new FormControl(''),
      nic0_port: new FormControl(''),
      // nic1_mac: new FormControl('', [Validators.pattern(this.macPattern)]),
      // nic1_mac: new FormControl('', RxwebValidators.mac()),
      nic1_mac: new FormControl('',
        [RxwebValidators.mask({mask:'**:**:**:**:**:**',valueWithMask:true }),RxwebValidators.mac()]
      ),
      nic1_ip: new FormControl('',
        [
          RxwebValidators.ip()
        ]),
      nic1_subnet: new FormControl(''),
      nic1_gateway: new FormControl(''),
      nic1_port: new FormControl(''),
      // nic2_mac: new FormControl('', [Validators.pattern(this.macPattern)]),
      nic2_mac: new FormControl('',
        [RxwebValidators.mask({mask:'**:**:**:**:**:**',valueWithMask:true }),RxwebValidators.mac()]),

      nic2_ip: new FormControl('' ,[
        RxwebValidators.ip()
      ] ),
      nic2_subnet: new FormControl(''),
      nic2_gateway: new FormControl(''),
      nic2_port: new FormControl(''),
      remote_ip: new FormControl(''),
      os_version: new FormControl(''),
      os_login: new FormControl(''),
      os_password: new FormControl(''),
      server_version: new FormControl(''),
      server_login: new FormControl(''),
      server_password: new FormControl(''),
      location: new FormControl(''),
      notes: new FormControl('')
    });
    this.myForm.markAllAsTouched();
  }

  async loadSysServerByID() {
    this.id = this.data.id || this.current_system_server_id;
    const params = {
      //action: 'getSysServerByID',
      //module: 'system_servers',
      id: this.id,
    };
    const endpoint=  'system_servers/getSysServerByID';
    this.AC.post(params,endpoint).subscribe((answer: any) => {
      this.myForm.patchValue(
        {
          id: Number(answer.system_servers.id),
          site_id: Number(answer.system_servers.site_id),
          system_type: answer.system_servers.system_type,
          brand_id: Number(answer.system_servers.brand_id),
          server_type: answer.system_servers.server_type,
          name: answer.system_servers.name,
          product_id: Number(answer.system_servers.product_id),
          serial_number: answer.system_servers.serial_number,
          service_tag: answer.system_servers.service_tag,
          nic0_mac: answer.system_servers.nic0_mac,
          nic0_ip: answer.system_servers.nic0_ip,
          nic0_subnet: answer.system_servers.nic0_subnet,
          nic0_gateway: answer.system_servers.nic0_gateway,
          nic0_port: answer.system_servers.nic0_port,
          nic1_mac: answer.system_servers.nic1_mac,
          nic1_ip: answer.system_servers.nic1_ip,
          nic1_subnet: answer.system_servers.nic1_subnet,
          nic1_gateway: answer.system_servers.nic1_gateway,
          nic1_port: answer.system_servers.nic1_port,
          nic2_mac: answer.system_servers.nic2_mac,
          nic2_ip: answer.system_servers.nic2_ip,
          nic2_subnet: answer.system_servers.nic2_subnet,
          nic2_gateway: answer.system_servers.nic2_gateway,
          nic2_port: answer.system_servers.nic2_port,
          remote_ip: answer.system_servers.remote_ip,
          os_version: answer.system_servers.os_version,
          os_login: answer.system_servers.os_login,
          os_password: answer.system_servers.os_password,
          server_version: answer.system_servers.server_version,
          server_login: answer.system_servers.server_login,
          server_password: answer.system_servers.server_password,
          location: answer.system_servers.location,
          notes: answer.system_servers.notes,
        });
      this.changeDetectorRef.detectChanges();
      this.selected_brand = Number(answer.system_servers.brand_id);
      this.selected_product_id = Number(answer.system_servers.product_id);
      this.selected_system_type = answer.system_servers.system_type;
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
      //module: 'products',
      // brand_id: Number(this.selected_brand),
      // category_id: 0,
      // type_id: 0
    };
    const endpoint= 'products/getAll' ;
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

    }
    if (this.action.toLowerCase() === 'edit') {
      this.myForm.removeControl('site_id');
      this.myForm.patchValue({
        id: this.data.id
      });
    }
    const params = {
      //action: this.action.toLowerCase() === 'add' ? 'put' : 'post',
      //module: 'system_servers',
      form: this.myForm.value,
    };
    console.dir(params);
    const endpoint=  this.action.toLowerCase() === 'add' ? 'system_servers/put' : 'system_servers/post';
    this.AC.post(this.myForm.value,endpoint).subscribe((answer: any) => {
      this.action.toLowerCase() === 'add' ?
        this.AC.setNewSystemServer(answer.system_servers) :
        this.AC.setUpdatedSystemServer(answer.system_servers);
      this.closeDialog();
    });
  }

  loadListOfServerTypes(system_type) {
    switch (system_type) {
      case 'CCTV':
        this.listOfServerTypes = [
          { Id: 1, servertype: 'Appliance' },
          { Id: 2, servertype: 'Archive' },
          { Id: 3, servertype: 'DVR' },
          { Id: 4, servertype: 'NVR' },
          { Id: 5, servertype: 'Server' },
          { Id: 6, servertype: 'Workstation' },
        ];
        break;
      case 'ACCESS':
        this.listOfServerTypes = [
          { Id: 1, servertype: 'Appliance' },
          { Id: 2, servertype: 'Server' },
          { Id: 3, servertype: 'Virtual Server' },
          { Id: 4, servertype: 'Workstation' },
        ];
        break;
      case 'NETWORK':
        this.listOfServerTypes = [
          { Id: 1, devicetype: 'Database Server' },
          { Id: 2, devicetype: 'DHCP Server' },
          { Id: 3, devicetype: 'DNS Server' },
          { Id: 4, devicetype: 'eMail Server' },
          { Id: 5, devicetype: 'File Server' },
          { Id: 6, devicetype: 'FTP Server' },
          { Id: 7, devicetype: 'Web Proxy Server' },
          { Id: 8, devicetype: 'Web Server' },
        ];
        break;

      default:
        console.log("NO TAB Selected");
        break;
    }
    return this.listOfServerTypes;
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
  macAddressConstructor(event){
    console.log(event);
    console.log(this._macRegex.test(event));
    if (!this._macRegex.test(event)) {
      return ;
    }
    console.log(this.functionsService.macAddressConstructor(event));
    return this.functionsService.macAddressConstructor(event);
  }
}


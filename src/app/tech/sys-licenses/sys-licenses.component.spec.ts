import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysLicensesComponent } from './sys-licenses.component';

describe('SysLicensesComponent', () => {
  let component: SysLicensesComponent;
  let fixture: ComponentFixture<SysLicensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysLicensesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SysLicensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

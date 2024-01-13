import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySuppliercontactComponent } from './summary-suppliercontact.component';

describe('SummarySuppliercontactComponent', () => {
  let component: SummarySuppliercontactComponent;
  let fixture: ComponentFixture<SummarySuppliercontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarySuppliercontactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarySuppliercontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

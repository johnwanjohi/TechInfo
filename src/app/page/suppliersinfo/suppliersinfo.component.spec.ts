import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersinfoComponent } from './suppliersinfo.component';

describe('SuppliersinfoComponent', () => {
  let component: SuppliersinfoComponent;
  let fixture: ComponentFixture<SuppliersinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppliersinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliersinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

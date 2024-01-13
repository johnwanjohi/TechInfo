import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySupplierComponent } from './summary-supplier.component';

describe('SummarySupplierComponent', () => {
  let component: SummarySupplierComponent;
  let fixture: ComponentFixture<SummarySupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarySupplierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarySupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

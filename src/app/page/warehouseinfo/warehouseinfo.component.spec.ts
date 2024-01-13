import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseinfoComponent } from './warehouseinfo.component';

describe('WarehouseinfoComponent', () => {
  let component: WarehouseinfoComponent;
  let fixture: ComponentFixture<WarehouseinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

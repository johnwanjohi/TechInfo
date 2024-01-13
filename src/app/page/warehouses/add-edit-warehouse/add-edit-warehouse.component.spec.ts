import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditWarehouseComponent } from './add-edit-warehouse.component';

describe('AddEditWarehouseComponent', () => {
  let component: AddEditWarehouseComponent;
  let fixture: ComponentFixture<AddEditWarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditWarehouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

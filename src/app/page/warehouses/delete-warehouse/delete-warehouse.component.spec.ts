import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteWarehouseComponent } from './delete-warehouse.component';

describe('DeleteWarehouseComponent', () => {
  let component: DeleteWarehouseComponent;
  let fixture: ComponentFixture<DeleteWarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteWarehouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAdjustmentComponent } from './add-edit-adjustment.component';

describe('AddEditAdjustmentComponent', () => {
  let component: AddEditAdjustmentComponent;
  let fixture: ComponentFixture<AddEditAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditAdjustmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

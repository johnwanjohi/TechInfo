import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditWhOrderComponent } from './add-edit-wh-order.component';

describe('AddEditWhOrderComponent', () => {
  let component: AddEditWhOrderComponent;
  let fixture: ComponentFixture<AddEditWhOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditWhOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditWhOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

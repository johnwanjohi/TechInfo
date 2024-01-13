import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSubcontactComponent } from './add-edit-subcontact.component';

describe('AddEditSubcontactComponent', () => {
  let component: AddEditSubcontactComponent;
  let fixture: ComponentFixture<AddEditSubcontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSubcontactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSubcontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSysDoorComponent } from './add-edit-sys-door.component';

describe('AddEditSysDoorComponent', () => {
  let component: AddEditSysDoorComponent;
  let fixture: ComponentFixture<AddEditSysDoorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSysDoorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSysDoorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

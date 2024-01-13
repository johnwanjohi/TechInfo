import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSysServerComponent } from './add-edit-sys-server.component';

describe('AddEditSysServerComponent', () => {
  let component: AddEditSysServerComponent;
  let fixture: ComponentFixture<AddEditSysServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSysServerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSysServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

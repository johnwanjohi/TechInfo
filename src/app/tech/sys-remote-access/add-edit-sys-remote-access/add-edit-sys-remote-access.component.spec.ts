import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSysRemoteAccessComponent } from './add-edit-sys-remote-access.component';

describe('AddEditSysRemoteAccessComponent', () => {
  let component: AddEditSysRemoteAccessComponent;
  let fixture: ComponentFixture<AddEditSysRemoteAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSysRemoteAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSysRemoteAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

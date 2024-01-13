import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSysZonesComponent } from './add-edit-sys-zones.component';

describe('AddEditSysZonesComponent', () => {
  let component: AddEditSysZonesComponent;
  let fixture: ComponentFixture<AddEditSysZonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSysZonesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSysZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVanreturnComponent } from './add-edit-vanreturn.component';

describe('AddEditVanreturnComponent', () => {
  let component: AddEditVanreturnComponent;
  let fixture: ComponentFixture<AddEditVanreturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditVanreturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditVanreturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

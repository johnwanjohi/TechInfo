import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVanstockComponent } from './add-edit-vanstock.component';

describe('AddEditVanstockComponent', () => {
  let component: AddEditVanstockComponent;
  let fixture: ComponentFixture<AddEditVanstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditVanstockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditVanstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

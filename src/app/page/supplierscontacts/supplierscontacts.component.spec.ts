import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierscontactsComponent } from './supplierscontacts.component';

describe('SupplierscontactsComponent', () => {
  let component: SupplierscontactsComponent;
  let fixture: ComponentFixture<SupplierscontactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierscontactsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierscontactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

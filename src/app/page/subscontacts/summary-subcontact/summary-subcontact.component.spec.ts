import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySubcontactComponent } from './summary-subcontact.component';

describe('SummarySubcontactComponent', () => {
  let component: SummarySubcontactComponent;
  let fixture: ComponentFixture<SummarySubcontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarySubcontactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarySubcontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryContactComponent } from './summary-contact.component';

describe('SummaryContactComponent', () => {
  let component: SummaryContactComponent;
  let fixture: ComponentFixture<SummaryContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

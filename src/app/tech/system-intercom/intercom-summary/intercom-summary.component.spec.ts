import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntercomSummaryComponent } from './intercom-summary.component';

describe('IntercomSummaryComponent', () => {
  let component: IntercomSummaryComponent;
  let fixture: ComponentFixture<IntercomSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntercomSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntercomSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

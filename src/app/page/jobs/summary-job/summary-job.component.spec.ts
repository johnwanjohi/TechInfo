import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryJobComponent } from './summary-job.component';

describe('SummaryJobComponent', () => {
  let component: SummaryJobComponent;
  let fixture: ComponentFixture<SummaryJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsinfoComponent } from './jobsinfo.component';

describe('JobsinfoComponent', () => {
  let component: JobsinfoComponent;
  let fixture: ComponentFixture<JobsinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

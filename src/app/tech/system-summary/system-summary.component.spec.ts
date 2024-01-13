import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSummaryComponent } from './system-summary.component';

describe('SystemSummaryComponent', () => {
  let component: SystemSummaryComponent;
  let fixture: ComponentFixture<SystemSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

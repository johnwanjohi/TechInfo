import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurglarySummaryComponent } from './burglary-summary.component';

describe('BurglarySummaryComponent', () => {
  let component: BurglarySummaryComponent;
  let fixture: ComponentFixture<BurglarySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BurglarySummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BurglarySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

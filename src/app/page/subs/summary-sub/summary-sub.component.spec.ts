import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySubComponent } from './summary-sub.component';

describe('SummarySubComponent', () => {
  let component: SummarySubComponent;
  let fixture: ComponentFixture<SummarySubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarySubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarySubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

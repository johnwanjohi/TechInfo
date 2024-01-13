import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CctvSummaryComponent } from './cctv-summary.component';

describe('CctvSummaryComponent', () => {
  let component: CctvSummaryComponent;
  let fixture: ComponentFixture<CctvSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CctvSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CctvSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

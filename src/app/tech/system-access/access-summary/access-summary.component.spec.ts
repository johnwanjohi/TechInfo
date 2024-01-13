import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessSummaryComponent } from './access-summary.component';

describe('AccessSummaryComponent', () => {
  let component: AccessSummaryComponent;
  let fixture: ComponentFixture<AccessSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

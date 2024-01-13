import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryPackageComponent } from './summary-package.component';

describe('SummaryPackageComponent', () => {
  let component: SummaryPackageComponent;
  let fixture: ComponentFixture<SummaryPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryPackageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

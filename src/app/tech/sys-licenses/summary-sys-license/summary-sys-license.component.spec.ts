import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySysLicenseComponent } from './summary-sys-license.component';

describe('SummarySysLicenseComponent', () => {
  let component: SummarySysLicenseComponent;
  let fixture: ComponentFixture<SummarySysLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarySysLicenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarySysLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

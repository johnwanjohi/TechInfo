import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySysRemoteAccessComponent } from './summary-sys-remote-access.component';

describe('SummarySysRemoteAccessComponent', () => {
  let component: SummarySysRemoteAccessComponent;
  let fixture: ComponentFixture<SummarySysRemoteAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarySysRemoteAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarySysRemoteAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

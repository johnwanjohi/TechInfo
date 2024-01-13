import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySiteComponent } from './summary-site.component';

describe('SummarySiteComponent', () => {
  let component: SummarySiteComponent;
  let fixture: ComponentFixture<SummarySiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarySiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarySiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

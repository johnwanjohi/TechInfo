import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySitenoteComponent } from './summary-sitenote.component';

describe('SummarySitenoteComponent', () => {
  let component: SummarySitenoteComponent;
  let fixture: ComponentFixture<SummarySitenoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarySitenoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarySitenoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

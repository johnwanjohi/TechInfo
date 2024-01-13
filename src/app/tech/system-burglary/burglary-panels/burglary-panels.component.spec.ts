import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurglaryPanelsComponent } from './burglary-panels.component';

describe('BurglaryPanelsComponent', () => {
  let component: BurglaryPanelsComponent;
  let fixture: ComponentFixture<BurglaryPanelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BurglaryPanelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BurglaryPanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

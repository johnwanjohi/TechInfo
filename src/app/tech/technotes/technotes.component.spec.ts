import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnotesComponent } from './technotes.component';

describe('TechnotesComponent', () => {
  let component: TechnotesComponent;
  let fixture: ComponentFixture<TechnotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

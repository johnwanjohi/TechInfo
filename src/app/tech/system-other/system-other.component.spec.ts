import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemOtherComponent } from './system-other.component';

describe('SystemOtherComponent', () => {
  let component: SystemOtherComponent;
  let fixture: ComponentFixture<SystemOtherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemOtherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

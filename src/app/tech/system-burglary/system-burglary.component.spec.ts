import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemBurglaryComponent } from './system-burglary.component';

describe('SystemBurglaryComponent', () => {
  let component: SystemBurglaryComponent;
  let fixture: ComponentFixture<SystemBurglaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemBurglaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemBurglaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAccessComponent } from './system-access.component';

describe('SystemAccessComponent', () => {
  let component: SystemAccessComponent;
  let fixture: ComponentFixture<SystemAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntercomDevicesComponent } from './intercom-devices.component';

describe('IntercomDevicesComponent', () => {
  let component: IntercomDevicesComponent;
  let fixture: ComponentFixture<IntercomDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntercomDevicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntercomDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

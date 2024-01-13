import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemIntercomComponent } from './system-intercom.component';

describe('SystemIntercomComponent', () => {
  let component: SystemIntercomComponent;
  let fixture: ComponentFixture<SystemIntercomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemIntercomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemIntercomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

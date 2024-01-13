import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemCctvComponent } from './system-cctv.component';

describe('SystemCctvComponent', () => {
  let component: SystemCctvComponent;
  let fixture: ComponentFixture<SystemCctvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemCctvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemCctvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

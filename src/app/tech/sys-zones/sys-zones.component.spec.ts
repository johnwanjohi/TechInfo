import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysZonesComponent } from './sys-zones.component';

describe('SysZonesComponent', () => {
  let component: SysZonesComponent;
  let fixture: ComponentFixture<SysZonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysZonesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SysZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

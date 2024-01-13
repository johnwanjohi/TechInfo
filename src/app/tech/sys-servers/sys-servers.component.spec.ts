import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysServersComponent } from './sys-servers.component';

describe('SysServersComponent', () => {
  let component: SysServersComponent;
  let fixture: ComponentFixture<SysServersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysServersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SysServersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysRemoteAccessComponent } from './sys-remote-access.component';

describe('SysRemoteAccessComponent', () => {
  let component: SysRemoteAccessComponent;
  let fixture: ComponentFixture<SysRemoteAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysRemoteAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SysRemoteAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

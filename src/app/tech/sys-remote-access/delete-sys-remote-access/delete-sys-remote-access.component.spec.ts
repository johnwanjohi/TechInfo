import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSysRemoteAccessComponent } from './delete-sys-remote-access.component';

describe('DeleteSysRemoteAccessComponent', () => {
  let component: DeleteSysRemoteAccessComponent;
  let fixture: ComponentFixture<DeleteSysRemoteAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSysRemoteAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSysRemoteAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

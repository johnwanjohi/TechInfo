import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysDoorsComponent } from './sys-doors.component';

describe('SysDoorsComponent', () => {
  let component: SysDoorsComponent;
  let fixture: ComponentFixture<SysDoorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SysDoorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SysDoorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

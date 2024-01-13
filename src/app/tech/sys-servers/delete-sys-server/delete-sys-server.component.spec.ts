import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSysServerComponent } from './delete-sys-server.component';

describe('DeleteSysServerComponent', () => {
  let component: DeleteSysServerComponent;
  let fixture: ComponentFixture<DeleteSysServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSysServerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSysServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

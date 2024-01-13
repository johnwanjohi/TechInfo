import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSysZonesComponent } from './delete-sys-zones.component';

describe('DeleteSysZonesComponent', () => {
  let component: DeleteSysZonesComponent;
  let fixture: ComponentFixture<DeleteSysZonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSysZonesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSysZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

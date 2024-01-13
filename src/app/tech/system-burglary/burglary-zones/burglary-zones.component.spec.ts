import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurglaryZonesComponent } from './burglary-zones.component';

describe('BurglaryZonesComponent', () => {
  let component: BurglaryZonesComponent;
  let fixture: ComponentFixture<BurglaryZonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BurglaryZonesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BurglaryZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

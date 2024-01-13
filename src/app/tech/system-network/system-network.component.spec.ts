import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemNetworkComponent } from './system-network.component';

describe('SystemNetworkComponent', () => {
  let component: SystemNetworkComponent;
  let fixture: ComponentFixture<SystemNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemNetworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VanstockComponent } from './vanstock.component';

describe('VanstockComponent', () => {
  let component: VanstockComponent;
  let fixture: ComponentFixture<VanstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VanstockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VanstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

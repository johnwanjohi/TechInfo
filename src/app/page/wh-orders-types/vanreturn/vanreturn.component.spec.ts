import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VanreturnComponent } from './vanreturn.component';

describe('VanreturnComponent', () => {
  let component: VanreturnComponent;
  let fixture: ComponentFixture<VanreturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VanreturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VanreturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

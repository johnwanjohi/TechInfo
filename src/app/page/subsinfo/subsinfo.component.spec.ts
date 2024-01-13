import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsinfoComponent } from './subsinfo.component';

describe('SubsinfoComponent', () => {
  let component: SubsinfoComponent;
  let fixture: ComponentFixture<SubsinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubsinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

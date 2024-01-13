import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscontactsComponent } from './subscontacts.component';

describe('SubscontactsComponent', () => {
  let component: SubscontactsComponent;
  let fixture: ComponentFixture<SubscontactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscontactsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscontactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhOrdersDetailsComponent } from './wh-orders-details.component';

describe('WhOrdersDetailsComponent', () => {
  let component: WhOrdersDetailsComponent;
  let fixture: ComponentFixture<WhOrdersDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhOrdersDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhOrdersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

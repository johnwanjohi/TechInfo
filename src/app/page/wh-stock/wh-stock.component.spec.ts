import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhStockComponent } from './wh-stock.component';

describe('WhStockComponent', () => {
  let component: WhStockComponent;
  let fixture: ComponentFixture<WhStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

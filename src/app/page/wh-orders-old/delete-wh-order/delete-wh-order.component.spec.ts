import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteWhOrderComponent } from './delete-wh-order.component';

describe('DeleteWhOrderComponent', () => {
  let component: DeleteWhOrderComponent;
  let fixture: ComponentFixture<DeleteWhOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteWhOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteWhOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

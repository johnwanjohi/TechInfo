import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAdjustmentComponent } from './delete-adjustment.component';

describe('DeleteAdjustmentComponent', () => {
  let component: DeleteAdjustmentComponent;
  let fixture: ComponentFixture<DeleteAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteAdjustmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

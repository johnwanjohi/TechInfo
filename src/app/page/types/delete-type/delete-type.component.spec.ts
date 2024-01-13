import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTypeComponent } from './delete-type.component';

describe('DeleteTypeComponent', () => {
  let component: DeleteTypeComponent;
  let fixture: ComponentFixture<DeleteTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSysDoorComponent } from './delete-sys-door.component';

describe('DeleteSysDoorComponent', () => {
  let component: DeleteSysDoorComponent;
  let fixture: ComponentFixture<DeleteSysDoorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSysDoorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSysDoorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

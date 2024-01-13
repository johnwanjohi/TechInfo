import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteVanreturnComponent } from './delete-vanreturn.component';

describe('DeleteVanreturnComponent', () => {
  let component: DeleteVanreturnComponent;
  let fixture: ComponentFixture<DeleteVanreturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteVanreturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteVanreturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

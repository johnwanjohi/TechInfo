import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteVanstockComponent } from './delete-vanstock.component';

describe('DeleteVanstockComponent', () => {
  let component: DeleteVanstockComponent;
  let fixture: ComponentFixture<DeleteVanstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteVanstockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteVanstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSupplierstockComponent } from './delete-supplierstock.component';

describe('DeleteSupplierstockComponent', () => {
  let component: DeleteSupplierstockComponent;
  let fixture: ComponentFixture<DeleteSupplierstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSupplierstockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSupplierstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

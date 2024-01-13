import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSitenoteComponent } from './add-edit-sitenote.component';

describe('AddEditSitenoteComponent', () => {
  let component: AddEditSitenoteComponent;
  let fixture: ComponentFixture<AddEditSitenoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSitenoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSitenoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

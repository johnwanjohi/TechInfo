import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSubcontactComponent } from './delete-subcontact.component';

describe('DeleteSubcontactComponent', () => {
  let component: DeleteSubcontactComponent;
  let fixture: ComponentFixture<DeleteSubcontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSubcontactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSubcontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

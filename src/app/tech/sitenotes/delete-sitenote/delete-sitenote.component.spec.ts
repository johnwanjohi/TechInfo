import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSitenoteComponent } from './delete-sitenote.component';

describe('DeleteSitenoteComponent', () => {
  let component: DeleteSitenoteComponent;
  let fixture: ComponentFixture<DeleteSitenoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSitenoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSitenoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

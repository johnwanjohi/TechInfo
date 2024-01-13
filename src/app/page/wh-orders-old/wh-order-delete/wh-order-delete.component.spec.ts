import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WHOrderDeleteComponent } from './wh-order-delete.component';
describe('WHOrderDeleteComponent', () => {
  let component: WHOrderDeleteComponent;
  let fixture: ComponentFixture<WHOrderDeleteComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WHOrderDeleteComponent],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(WHOrderDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

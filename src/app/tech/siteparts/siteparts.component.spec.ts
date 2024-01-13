import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitepartsComponent } from './siteparts.component';

describe('SitepartsComponent', () => {
  let component: SitepartsComponent;
  let fixture: ComponentFixture<SitepartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SitepartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SitepartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

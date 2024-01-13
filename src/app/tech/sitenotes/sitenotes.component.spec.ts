import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitenotesComponent } from './sitenotes.component';

describe('SitenotesComponent', () => {
  let component: SitenotesComponent;
  let fixture: ComponentFixture<SitenotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SitenotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SitenotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

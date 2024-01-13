import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesinfoComponent } from './packagesinfo.component';

describe('PackagesinfoComponent', () => {
  let component: PackagesinfoComponent;
  let fixture: ComponentFixture<PackagesinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackagesinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagesinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

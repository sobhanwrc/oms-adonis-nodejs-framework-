import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTopbarComponent } from './vendor-topbar.component';

describe('VendorTopbarComponent', () => {
  let component: VendorTopbarComponent;
  let fixture: ComponentFixture<VendorTopbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorTopbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorForgetpswrdComponent } from './vendor-forgetpswrd.component';

describe('VendorForgetpswrdComponent', () => {
  let component: VendorForgetpswrdComponent;
  let fixture: ComponentFixture<VendorForgetpswrdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorForgetpswrdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorForgetpswrdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

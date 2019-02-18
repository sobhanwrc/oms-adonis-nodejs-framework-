import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSetpswrdComponent } from './vendor-setpswrd.component';

describe('VendorSetpswrdComponent', () => {
  let component: VendorSetpswrdComponent;
  let fixture: ComponentFixture<VendorSetpswrdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorSetpswrdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorSetpswrdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

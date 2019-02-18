import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTransdetailComponent } from './vendor-transdetail.component';

describe('VendorTransdetailComponent', () => {
  let component: VendorTransdetailComponent;
  let fixture: ComponentFixture<VendorTransdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorTransdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorTransdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

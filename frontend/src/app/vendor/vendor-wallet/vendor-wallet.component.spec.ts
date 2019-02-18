import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorWalletComponent } from './vendor-wallet.component';

describe('VendorWalletComponent', () => {
  let component: VendorWalletComponent;
  let fixture: ComponentFixture<VendorWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

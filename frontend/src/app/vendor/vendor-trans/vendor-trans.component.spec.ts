import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTransComponent } from './vendor-trans.component';

describe('VendorTransComponent', () => {
  let component: VendorTransComponent;
  let fixture: ComponentFixture<VendorTransComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorTransComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

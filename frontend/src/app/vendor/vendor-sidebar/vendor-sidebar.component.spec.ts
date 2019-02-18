import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSidebarComponent } from './vendor-sidebar.component';

describe('VendorSidebarComponent', () => {
  let component: VendorSidebarComponent;
  let fixture: ComponentFixture<VendorSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

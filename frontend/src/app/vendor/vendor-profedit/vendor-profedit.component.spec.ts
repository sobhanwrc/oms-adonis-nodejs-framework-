import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorProfeditComponent } from './vendor-profedit.component';

describe('VendorProfeditComponent', () => {
  let component: VendorProfeditComponent;
  let fixture: ComponentFixture<VendorProfeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorProfeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorProfeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

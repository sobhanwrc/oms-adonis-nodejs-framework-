import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTranscntComponent } from './vendor-transcnt.component';

describe('VendorTranscntComponent', () => {
  let component: VendorTranscntComponent;
  let fixture: ComponentFixture<VendorTranscntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorTranscntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorTranscntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

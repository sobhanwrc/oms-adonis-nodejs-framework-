import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdDonationComponent } from './ad-donation.component';

describe('AdDonationComponent', () => {
  let component: AdDonationComponent;
  let fixture: ComponentFixture<AdDonationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdDonationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

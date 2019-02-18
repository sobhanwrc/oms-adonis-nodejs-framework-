import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDonationCntComponent } from './add-donation-cnt.component';

describe('AddDonationCntComponent', () => {
  let component: AddDonationCntComponent;
  let fixture: ComponentFixture<AddDonationCntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDonationCntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDonationCntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

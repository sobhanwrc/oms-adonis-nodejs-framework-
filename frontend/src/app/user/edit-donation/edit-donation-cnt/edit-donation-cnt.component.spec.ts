import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDonationCntComponent } from './edit-donation-cnt.component';

describe('EditDonationCntComponent', () => {
  let component: EditDonationCntComponent;
  let fixture: ComponentFixture<EditDonationCntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDonationCntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDonationCntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

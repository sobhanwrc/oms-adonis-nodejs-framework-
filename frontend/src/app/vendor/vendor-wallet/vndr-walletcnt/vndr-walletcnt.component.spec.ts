import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VndrWalletcntComponent } from './vndr-walletcnt.component';

describe('VndrWalletcntComponent', () => {
  let component: VndrWalletcntComponent;
  let fixture: ComponentFixture<VndrWalletcntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VndrWalletcntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VndrWalletcntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

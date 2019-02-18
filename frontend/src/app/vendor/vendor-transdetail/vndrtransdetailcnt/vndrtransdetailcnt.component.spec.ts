import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VndrtransdetailcntComponent } from './vndrtransdetailcnt.component';

describe('VndrtransdetailcntComponent', () => {
  let component: VndrtransdetailcntComponent;
  let fixture: ComponentFixture<VndrtransdetailcntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VndrtransdetailcntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VndrtransdetailcntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

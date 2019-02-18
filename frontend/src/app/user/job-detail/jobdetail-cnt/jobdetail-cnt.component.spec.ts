import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobdetailCntComponent } from './jobdetail-cnt.component';

describe('JobdetailCntComponent', () => {
  let component: JobdetailCntComponent;
  let fixture: ComponentFixture<JobdetailCntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobdetailCntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobdetailCntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

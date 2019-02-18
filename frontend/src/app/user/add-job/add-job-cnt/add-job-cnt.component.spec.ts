import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJobCntComponent } from './add-job-cnt.component';

describe('AddJobCntComponent', () => {
  let component: AddJobCntComponent;
  let fixture: ComponentFixture<AddJobCntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddJobCntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJobCntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

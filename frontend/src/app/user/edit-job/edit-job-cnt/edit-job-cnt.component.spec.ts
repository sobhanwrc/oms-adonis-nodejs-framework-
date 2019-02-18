import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJobCntComponent } from './edit-job-cnt.component';

describe('EditJobCntComponent', () => {
  let component: EditJobCntComponent;
  let fixture: ComponentFixture<EditJobCntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditJobCntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditJobCntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

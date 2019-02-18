import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyjobCntComponent } from './myjob-cnt.component';

describe('MyjobCntComponent', () => {
  let component: MyjobCntComponent;
  let fixture: ComponentFixture<MyjobCntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyjobCntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyjobCntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

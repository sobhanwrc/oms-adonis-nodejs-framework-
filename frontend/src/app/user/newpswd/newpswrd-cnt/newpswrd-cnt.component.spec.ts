import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpswrdCntComponent } from './newpswrd-cnt.component';

describe('NewpswrdCntComponent', () => {
  let component: NewpswrdCntComponent;
  let fixture: ComponentFixture<NewpswrdCntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewpswrdCntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewpswrdCntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetpswrdComponent } from './forgetpswrd.component';

describe('ForgetpswrdComponent', () => {
  let component: ForgetpswrdComponent;
  let fixture: ComponentFixture<ForgetpswrdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgetpswrdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetpswrdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

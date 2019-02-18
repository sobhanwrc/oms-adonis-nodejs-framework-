import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpswdComponent } from './newpswd.component';

describe('NewpswdComponent', () => {
  let component: NewpswdComponent;
  let fixture: ComponentFixture<NewpswdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewpswdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewpswdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

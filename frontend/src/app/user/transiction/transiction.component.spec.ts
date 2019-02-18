import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransictionComponent } from './transiction.component';

describe('TransictionComponent', () => {
  let component: TransictionComponent;
  let fixture: ComponentFixture<TransictionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransictionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EatCompContComponent } from './eat-comp-cont.component';

describe('EatCompContComponent', () => {
  let component: EatCompContComponent;
  let fixture: ComponentFixture<EatCompContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EatCompContComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EatCompContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

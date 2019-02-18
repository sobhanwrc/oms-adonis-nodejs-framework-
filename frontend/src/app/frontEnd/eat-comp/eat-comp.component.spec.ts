import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EatCompComponent } from './eat-comp.component';

describe('EatCompComponent', () => {
  let component: EatCompComponent;
  let fixture: ComponentFixture<EatCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EatCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EatCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermContentComponent } from './term-content.component';

describe('TermContentComponent', () => {
  let component: TermContentComponent;
  let fixture: ComponentFixture<TermContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

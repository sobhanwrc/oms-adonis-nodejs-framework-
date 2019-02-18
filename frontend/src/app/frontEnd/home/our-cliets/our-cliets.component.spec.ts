import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurClietsComponent } from './our-cliets.component';

describe('OurClietsComponent', () => {
  let component: OurClietsComponent;
  let fixture: ComponentFixture<OurClietsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurClietsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurClietsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

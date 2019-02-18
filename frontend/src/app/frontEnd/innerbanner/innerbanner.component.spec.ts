import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerbannerComponent } from './innerbanner.component';

describe('InnerbannerComponent', () => {
  let component: InnerbannerComponent;
  let fixture: ComponentFixture<InnerbannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnerbannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

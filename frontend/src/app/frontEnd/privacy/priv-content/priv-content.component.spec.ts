import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivContentComponent } from './priv-content.component';

describe('PrivContentComponent', () => {
  let component: PrivContentComponent;
  let fixture: ComponentFixture<PrivContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

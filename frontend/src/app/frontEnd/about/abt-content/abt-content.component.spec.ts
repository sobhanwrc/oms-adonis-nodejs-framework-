import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbtContentComponent } from './abt-content.component';

describe('AbtContentComponent', () => {
  let component: AbtContentComponent;
  let fixture: ComponentFixture<AbtContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbtContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbtContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

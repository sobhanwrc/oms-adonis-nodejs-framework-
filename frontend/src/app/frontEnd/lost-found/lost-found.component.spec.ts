import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LostFoundComponent } from './lost-found.component';

describe('LostFoundComponent', () => {
  let component: LostFoundComponent;
  let fixture: ComponentFixture<LostFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LostFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LostFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

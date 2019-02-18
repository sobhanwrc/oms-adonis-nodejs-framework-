import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LostFoundCntrComponent } from './lost-found-cntr.component';

describe('LostFoundCntrComponent', () => {
  let component: LostFoundCntrComponent;
  let fixture: ComponentFixture<LostFoundCntrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LostFoundCntrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LostFoundCntrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

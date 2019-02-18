import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LostFndCntntComponent } from './lost-fnd-cntnt.component';

describe('LostFndCntntComponent', () => {
  let component: LostFndCntntComponent;
  let fixture: ComponentFixture<LostFndCntntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LostFndCntntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LostFndCntntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

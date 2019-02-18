import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashCntComponent } from './dash-cnt.component';

describe('DashCntComponent', () => {
  let component: DashCntComponent;
  let fixture: ComponentFixture<DashCntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashCntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashCntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

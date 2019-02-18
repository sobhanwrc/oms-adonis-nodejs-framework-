import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DtailCntComponent } from './dtail-cnt.component';

describe('DtailCntComponent', () => {
  let component: DtailCntComponent;
  let fixture: ComponentFixture<DtailCntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DtailCntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DtailCntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

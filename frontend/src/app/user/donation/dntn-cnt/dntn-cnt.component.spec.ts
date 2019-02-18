import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DntnCntComponent } from './dntn-cnt.component';

describe('DntnCntComponent', () => {
  let component: DntnCntComponent;
  let fixture: ComponentFixture<DntnCntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DntnCntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DntnCntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

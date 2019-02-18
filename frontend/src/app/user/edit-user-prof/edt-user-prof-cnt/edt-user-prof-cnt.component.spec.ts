import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdtUserProfCntComponent } from './edt-user-prof-cnt.component';

describe('EdtUserProfCntComponent', () => {
  let component: EdtUserProfCntComponent;
  let fixture: ComponentFixture<EdtUserProfCntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdtUserProfCntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdtUserProfCntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

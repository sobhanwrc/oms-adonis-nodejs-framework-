import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifCntComponent } from './notif-cnt.component';

describe('NotifCntComponent', () => {
  let component: NotifCntComponent;
  let fixture: ComponentFixture<NotifCntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifCntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifCntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

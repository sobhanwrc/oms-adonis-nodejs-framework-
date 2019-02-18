import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfCntComponent } from './user-prof-cnt.component';

describe('UserProfCntComponent', () => {
  let component: UserProfCntComponent;
  let fixture: ComponentFixture<UserProfCntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfCntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfCntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

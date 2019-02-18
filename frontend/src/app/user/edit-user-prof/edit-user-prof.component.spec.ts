import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserProfComponent } from './edit-user-prof.component';

describe('EditUserProfComponent', () => {
  let component: EditUserProfComponent;
  let fixture: ComponentFixture<EditUserProfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUserProfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserProfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

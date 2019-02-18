import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VndorProfcntComponent } from './vndor-profcnt.component';

describe('VndorProfcntComponent', () => {
  let component: VndorProfcntComponent;
  let fixture: ComponentFixture<VndorProfcntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VndorProfcntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VndorProfcntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

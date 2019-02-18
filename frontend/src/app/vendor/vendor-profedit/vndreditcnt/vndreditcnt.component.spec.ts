import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VndreditcntComponent } from './vndreditcnt.component';

describe('VndreditcntComponent', () => {
  let component: VndreditcntComponent;
  let fixture: ComponentFixture<VndreditcntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VndreditcntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VndreditcntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

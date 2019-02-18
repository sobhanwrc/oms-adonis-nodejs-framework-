import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransCntComponent } from './trans-cnt.component';

describe('TransCntComponent', () => {
  let component: TransCntComponent;
  let fixture: ComponentFixture<TransCntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransCntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransCntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

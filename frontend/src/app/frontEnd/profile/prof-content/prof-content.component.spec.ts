import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfContentComponent } from './prof-content.component';

describe('ProfContentComponent', () => {
  let component: ProfContentComponent;
  let fixture: ComponentFixture<ProfContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

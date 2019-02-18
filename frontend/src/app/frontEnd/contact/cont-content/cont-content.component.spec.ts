import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContContentComponent } from './cont-content.component';

describe('ContContentComponent', () => {
  let component: ContContentComponent;
  let fixture: ComponentFixture<ContContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

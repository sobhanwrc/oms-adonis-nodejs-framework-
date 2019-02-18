import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestServicesComponent } from './latest-services.component';

describe('LatestServicesComponent', () => {
  let component: LatestServicesComponent;
  let fixture: ComponentFixture<LatestServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

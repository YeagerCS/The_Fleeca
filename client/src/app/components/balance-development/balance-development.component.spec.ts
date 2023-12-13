import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceDevelopmentComponent } from './balance-development.component';

describe('BalanceDevelopmentComponent', () => {
  let component: BalanceDevelopmentComponent;
  let fixture: ComponentFixture<BalanceDevelopmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BalanceDevelopmentComponent]
    });
    fixture = TestBed.createComponent(BalanceDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestTransactionsComponent } from './latest-transactions.component';

describe('LatestTransactionsComponent', () => {
  let component: LatestTransactionsComponent;
  let fixture: ComponentFixture<LatestTransactionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LatestTransactionsComponent]
    });
    fixture = TestBed.createComponent(LatestTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

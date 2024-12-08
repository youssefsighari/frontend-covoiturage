import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTripsComponent } from './customer-trips.component';

describe('CustomerTripsComponent', () => {
  let component: CustomerTripsComponent;
  let fixture: ComponentFixture<CustomerTripsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerTripsComponent]
    });
    fixture = TestBed.createComponent(CustomerTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

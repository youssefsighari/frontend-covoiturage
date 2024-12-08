import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/service/trip.service';

@Component({
  selector: 'app-customer-trips',
  templateUrl: './customer-trips.component.html',
  styleUrls: ['./customer-trips.component.scss']
})
export class CustomerTripsComponent implements OnInit {
  customerTrips: any[] = [];

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    const customerId = Number(localStorage.getItem('customerId'));
    if (customerId) {
      this.tripService.getTripsByCustomer(customerId).subscribe(
        (trips) => {
          this.customerTrips = trips;
          console.log('Customer trips loaded:', this.customerTrips);
        },
        (error) => {
          console.error('Error fetching customer trips:', error);
        }
      );
    } else {
      console.error('Customer ID not found in localStorage');
    }
  }
}

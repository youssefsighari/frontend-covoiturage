import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/service/trip.service';

@Component({
  selector: 'app-trip-requests',
  templateUrl: './trip-requests.component.html',
  styleUrls: ['./trip-requests.component.scss']
})
export class TripRequestsComponent implements OnInit {
  reservations: any[] = [];
  customerId: number = Number(localStorage.getItem('customerId')); 

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.getReservationsForUserTrips();
  }

  getReservationsForUserTrips(): void {
    this.tripService.getReservationsForUserTrips(this.customerId).subscribe(
      (response) => {
        this.reservations = response;
        console.log('Reservations for user trips loaded:', this.reservations);
      },
      (error) => {
        console.error('Error loading reservations for user trips:', error);
      }
    );
  }

  acceptReservation(requestId: number): void {
    this.tripService.updateRequestStatus(requestId, 'accepted').subscribe(
      () => {
        alert('Reservation accepted');
        this.getReservationsForUserTrips(); 
      },
      (error) => {
        console.error('Error accepting reservation:', error);
        alert('Failed to accept reservation');
      }
    );
  }

  refuseReservation(requestId: number): void {
    this.tripService.updateRequestStatus(requestId, 'refused').subscribe(
      () => {
        alert('Reservation refused');
        this.getReservationsForUserTrips(); 
      },
      (error) => {
        console.error('Error refusing reservation:', error);
        alert('Failed to refuse reservation');
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TripService } from 'src/app/service/trip.service';
import { UserService } from 'src/app/service/user.service'

@Component({
  selector: 'app-trip-list',
  templateUrl: './triplist.component.html',
  styleUrls: ['./triplist.component.scss']
})
export class TripListComponent implements OnInit {
  trips: any[] = [];
  departure: string = '';
  destination: string = '';
  date: string = '';
  time: string = '';

  customerId: number = 1; 
  reservedTrips: Set<number> = new Set();

  constructor(private tripService: TripService, private router: Router,  private userService: UserService) {}

  ngOnInit(): void {
    this.loadTrips();
    setInterval(() => this.loadTrips(), 3600000); 
  }

  goToEditTrip(tripId: number): void {
    // Naviguer vers la page d'édition du trip
    this.router.navigate(['/editTrip', tripId]);
  }

  loadProfilePhotos(): void {
    this.trips.forEach((trip) => {
      if (trip.customer && trip.customer.profilePhoto) {
        this.userService.getProfilePhoto(trip.customer.profilePhoto).subscribe({
          next: (blob: Blob) => {
            const url = URL.createObjectURL(blob);
            trip.customer.profilePhotoUrl = url;
          },
          error: (err) => {
            console.error('Erreur lors du chargement de la photo de profil pour le trip:', trip.id, err);
            trip.customer.profilePhotoUrl = 'assets/images/pdp.png';
          },
        });
      } else {
        trip.customer.profilePhotoUrl = 'assets/images/pdp.png';
      }
    });
  }

  loadTrips(): void {
    this.tripService.getAllTrips().subscribe(
      (response: any[]) => {
        this.trips = response;
        console.log('Trips loaded:', this.trips);
  
        const customerId = Number(localStorage.getItem('customerId'));
        if (customerId) {
          this.trips.forEach((trip) => {
            this.tripService.checkReservationExists(trip.id, customerId).subscribe(
              (isReserved: boolean) => {
                trip.isReserved = isReserved;
              },
              (error) => {
                console.error('Error checking reservation for trip:', trip.id, error);
              }
            );
          });
        }
  
        // Charger les photos de profil pour chaque trajet
        this.loadProfilePhotos();
      },
      (error) => {
        console.error('Error fetching trips:', error);
      }
    );
  }
  

  searchTrips(): void {
    this.tripService.searchTrips(this.departure, this.destination, this.date, this.time).subscribe(
      (response: any[]) => {
        this.trips = response;
        console.log('Trips found:', this.trips);
      },
      (error) => {
        console.error('Error searching trips:', error);
      }
    );
  }

  reserveSeat(tripId: number) {
    const customerId = Number(localStorage.getItem('customerId'));
    const passengerName = localStorage.getItem('username') || 'Nom du Passager';

  
    console.log(`Reserving seat for tripId: ${tripId}, passengerName: ${passengerName}, customerId: ${customerId}`);
  
    if (!customerId) {
      console.error('Erreur : customerId non trouvé dans localStorage');
      alert('Impossible de réserver : Utilisateur non authentifié');
      return;
    }
  
    this.tripService.reserveSeat(tripId, passengerName, customerId).subscribe({
      next: (response) => {
        console.log('Réservation réussie:', response);
        alert('Réservation réussie');
        
        
        const trip = this.trips.find(t => t.id === tripId);
        if (trip) {
          trip.isReserved = true;
          if (trip.availableSeats > 0) {
            trip.availableSeats -= 1; 
          }
        }
      },
      error: (error) => {
        console.error('Erreur de réservation:', error);
        alert('Échec de la réservation');
      }
    });
  }
  
  cancelReservation(tripId: number) {
    const customerId = Number(localStorage.getItem('customerId'));
    if (!customerId) {
      console.error('Erreur : customerId non trouvé dans localStorage');
      alert('Impossible d\'annuler : Utilisateur non authentifié');
      return;
    }
  
    this.tripService.cancelReservation(tripId, customerId).subscribe({
      next: (response) => {
        console.log('Réservation annulée avec succès:', response);
        alert('Réservation annulée avec succès');

        
        const trip = this.trips.find(t => t.id === tripId);
        if (trip) {
          trip.isReserved = false;
          trip.availableSeats += 1; 
        }
      },
      error: (error) => {
        console.error('Erreur d\'annulation de réservation:', error);
        alert('Échec de l\'annulation de la réservation');
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  goToCreatorProfile(customerId: number): void {
    if (customerId) {
      this.router.navigate(['/profile', customerId]); // Redirige vers la page profil avec l'ID du créateur
    }
  }
  
}

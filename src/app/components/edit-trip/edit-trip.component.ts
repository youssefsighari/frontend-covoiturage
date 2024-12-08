import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from 'src/app/service/trip.service';

@Component({
  selector: 'app-edit-trip',
  templateUrl: './edit-trip.component.html', // Vérifiez que ce fichier existe
  styleUrls: ['./edit-trip.component.scss'] // Vérifiez aussi ce fichier
})
export class EditTripComponent implements OnInit {
  tripForm: FormGroup;
  tripId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private tripService: TripService,
    private router: Router
  ) {
    // Initialisation du formulaire
    this.tripForm = this.fb.group({
      departure: ['', Validators.required],
      destination: ['', Validators.required],
      date: ['', [Validators.required, this.validateDate]],
      time: ['', [Validators.required, this.validateTime]],
      availableSeats: ['', [Validators.required, Validators.min(1), Validators.max(4)]],
      pricePerPassenger: ['', [Validators.required, Validators.min(1)]],
    }, { validators: this.validateSameLocation });
  }

  ngOnInit(): void {
    // Récupérer l'ID du trip depuis l'URL
    this.tripId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTripDetails();
  }

  loadTripDetails(): void {
    this.tripService.getTripById(this.tripId).subscribe(
      (response) => {
        this.tripForm.patchValue(response);
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails du trip :', error);
      }
    );
  }

  updateTrip(): void {
    if (this.tripForm.invalid) {
      return;
    }

    this.tripService.updateTrip(this.tripId, this.tripForm.value).subscribe(
      () => {
        this.router.navigate(['/Trips']);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du trip :', error);
      }
    );
  }

  validateSameLocation(group: FormGroup) {
    const departure = group.get('departure')?.value;
    const destination = group.get('destination')?.value;
    return departure && destination && departure === destination
      ? { sameLocation: true }
      : null;
  }

  validateDate(control: any) {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return selectedDate <= currentDate ? { invalidDate: true } : null;
  }

  validateTime(control: any) {
    const selectedTime = control.value;
    const currentTime = new Date().toTimeString().slice(0, 5);
    const currentDate = new Date().toISOString().split('T')[0];
    if (control.parent && control.parent.get('date')?.value === currentDate) {
      return selectedTime <= currentTime ? { invalidTime: true } : null;
    }
    return null;
  }
}

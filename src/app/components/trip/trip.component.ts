import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TripService } from 'src/app/service/trip.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.scss']
})
export class TripComponent implements OnInit {
  tripForm!: FormGroup;
  customerName: string | null = '';

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerName = localStorage.getItem('firstName');
    this.tripForm = this.fb.group(
      {
        departure: ['', Validators.required],
        destination: ['', Validators.required],
        date: ['', [Validators.required, this.dateValidator]],
        time: ['', [Validators.required, this.timeValidator.bind(this)]], 
        availableSeats: ['', [Validators.required, Validators.min(1), Validators.max(4)]],
        pricePerPassenger: ['', [Validators.required, Validators.min(0)]]
      },
      { validators: this.departureDestinationValidator } 
    );
  }

  createTrip(): void {
    if (this.tripForm.valid) {
      
      const tripRequest = {
        ...this.tripForm.value,
        customerId: Number(localStorage.getItem('customerId')) 
      };
  
      this.tripService.createTrip(tripRequest).subscribe(
        response => {
          console.log('Trip created successfully:', response);
          this.router.navigate(['/Trips']);
        },
        error => {
          console.error('Error creating trip:', error);
        }
      );
    } else {
      console.log('Form is not valid');
    }
  }
  

  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const inputDate = new Date(control.value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Ignore l'heure actuelle, on compare juste la date
    if (inputDate < currentDate) {
      return { 'invalidDate': true };
    }
    return null;
  }

  timeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value || !this.tripForm) {
      return null;
    }

    const inputTime = control.value;
    const currentDate = new Date();
    const selectedDate = new Date(this.tripForm.get('date')?.value);

    
    if (selectedDate.toDateString() === currentDate.toDateString()) {
      const [inputHours, inputMinutes] = inputTime.split(':').map(Number);
      if (
        inputHours < currentDate.getHours() ||
        (inputHours === currentDate.getHours() && inputMinutes <= currentDate.getMinutes())
      ) {
        return { 'invalidTime': true };
      }
    }
    return null;
  }


  departureDestinationValidator(group: FormGroup): { [key: string]: boolean } | null {
    const departure = group.get('departure')?.value;
    const destination = group.get('destination')?.value;
  
    if (departure && destination && departure === destination) {
      return { sameLocation: true };
    }
    return null;
  }
  
  

  goToHome(): void {
    this.router.navigate(['/home']);
  }








}

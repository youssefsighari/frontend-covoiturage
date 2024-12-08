import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

const BASE_URL = "http://localhost:8080/trips/";

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(private http: HttpClient) { }

 

  createTrip(tripRequest: any): Observable<any> {
    const token = localStorage.getItem('jwt');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(BASE_URL + 'create', tripRequest, { headers });
    } else {
      console.error('JWT token not found in localStorage');
      return throwError(() => new Error('Unauthorized'));
    }
  }

  getTripsByCustomer(customerId: number): Observable<any> {
    const token = localStorage.getItem('jwt');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${BASE_URL}customer/${customerId}`, { headers });
    } else {
      console.error('JWT token not found in localStorage');
      throw new Error('Unauthorized');
    }
  }


  getReservationsForUserTrips(customerId: number): Observable<any> {
    const token = localStorage.getItem('jwt');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`http://localhost:8080/trips/reservationsForUserTrips/${customerId}`, { headers }).pipe(
        catchError((error) => {
          console.error('Error fetching reservations for user trips:', error);
          return throwError(() => new Error('Failed to fetch reservations for user trips'));
        })
      );
    } else {
      console.error('JWT token not found in localStorage');
      return throwError(() => new Error('Unauthorized'));
    }
  }
  
  
  updateRequestStatus(requestId: number, status: string): Observable<any> {
    const token = localStorage.getItem('jwt');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const url = `${BASE_URL}updateStatus`;
      const body = { requestId, status };
      return this.http.put(url, body, { headers });
    } else {
      console.error('JWT token not found in localStorage');
      return throwError(() => new Error('Unauthorized'));
    }
  }





  getAllTrips(): Observable<any> {
    const token = localStorage.getItem('jwt');

    if (token) {
        console.log('JWT token found:', token); // Log pour vérifier le token

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        console.log('Sending GET request to:', BASE_URL);

        return this.http.get('http://localhost:8080/trips/allTrips', { headers }).pipe(
            catchError((error) => {
                console.error('HTTP error occurred:', error);
                // Gestion des erreurs HTTP personnalisée
                return throwError(() => new Error(`HTTP error: ${error.message}`));
            })
        );
    } else {
        console.error('JWT token not found in localStorage');
        return throwError(() => new Error('Unauthorized'));
    }
}


searchTrips(departure: string | null, destination: string | null, date: string | null, time: string | null): Observable<any> {
  const token = localStorage.getItem('jwt');
  if (token) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let params: any = {};

    if (departure) params.departure = departure;
    if (destination) params.destination = destination;
    if (date) params.date = date;
    if (time) params.time = time;

    return this.http.get(BASE_URL + 'search', { headers, params }).pipe(
      catchError((error) => {
        console.error('HTTP error occurred:', error);
        return throwError(() => new Error(`HTTP error: ${error.message}`));
      })
    );
  } else {
    console.error('JWT token not found in localStorage');
    return throwError(() => new Error('Unauthorized'));
  }
}

checkReservationExists(tripId: number, customerId: number): Observable<boolean> {
  const token = localStorage.getItem('jwt');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.get<boolean>(`http://localhost:8080/trips/checkReservation?tripId=${tripId}&customerId=${customerId}`, { headers }).pipe(
    catchError((error) => {
      console.error('Error checking reservation:', error);
      return throwError(() => new Error('Failed to check reservation'));
    })
  );
}


  
reserveSeat(tripId: number, passengerName: string, customerId: number): Observable<any> {
  const token = localStorage.getItem('jwt');
  const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
  });
  const body = { tripId, passengerName, customerId }; // Assurez-vous que le format correspond bien

  console.log("Sending reservation request with body:", body);

  return this.http.post('http://localhost:8080/trips/reserve', body, { headers, responseType: 'text' }).pipe(
      catchError((error) => {
          console.error('Error reserving seat:', error);
          return throwError(() => new Error('Failed to reserve seat'));
      })
  );
}


cancelReservation(tripId: number, customerId: number): Observable<any> {
  const token = localStorage.getItem('jwt');
  const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
  });
  const body = { tripId, customerId };

  return this.http.post('http://localhost:8080/trips/cancelReservation', body, { headers, responseType: 'text' }).pipe(
      catchError((error) => {
          console.error('Error cancelling reservation:', error);
          return throwError(() => new Error('Failed to cancel reservation'));
      })
  );
}

getTripById(tripId: number): Observable<any> {
  const token = localStorage.getItem('jwt');
  if (token) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${BASE_URL}${tripId}`, { headers });
  } else {
    console.error('JWT token not found in localStorage');
    throw new Error('Unauthorized');
  }
}

updateTrip(tripId: number, tripData: any): Observable<any> {
  const token = localStorage.getItem('jwt');
  if (token) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${BASE_URL}update/${tripId}`, tripData, { headers });
  } else {
    console.error('JWT token not found in localStorage');
    throw new Error('Unauthorized');
  }
}





  
}

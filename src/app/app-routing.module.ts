import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { TripComponent } from './components/trip/trip.component';
import { HomeComponent } from './components/home/home.component';
import { TripListComponent } from './components/triplist/triplist.component';
import { CustomerTripsComponent } from './components/customer-trips/customer-trips.component';
import { TripRequestsComponent } from './components/trip-requests/trip-requests.component';
import { EditTripComponent } from './components/edit-trip/edit-trip.component';
import { ProfilePhotoComponent } from './components/profile-photo/profile-photo.component';


const routes: Routes = [
  {path : "register", component: RegisterComponent},
  {path : "login", component: LoginComponent},
  {path : "Trip", component: TripComponent},
  {path : "home", component: HomeComponent},
  {path : "Trips", component: TripListComponent},
  {path : "myTrips", component: CustomerTripsComponent},
  { path: 'requests', component: TripRequestsComponent },
  { path: 'editTrip/:id', component: EditTripComponent },
  { path: 'profile-photo', component: ProfilePhotoComponent },
  { path: 'profile/:id', component: ProfilePhotoComponent },
  
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { TripComponent } from './components/trip/trip.component';
import { HomeComponent } from './components/home/home.component';
import { TripListComponent } from './components/triplist/triplist.component';
import { FormsModule } from '@angular/forms';
import { CustomerTripsComponent } from './components/customer-trips/customer-trips.component';
import { TripRequestsComponent } from './components/trip-requests/trip-requests.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { EditTripComponent } from './components/edit-trip/edit-trip.component';
import { ProfilePhotoComponent } from './components/profile-photo/profile-photo.component';





@NgModule({
  declarations: [
    AppComponent, 
    RegisterComponent,
    LoginComponent,
    TripComponent,
    HomeComponent,
    TripListComponent,
    CustomerTripsComponent,
    TripRequestsComponent,
    NavbarComponent,
    EditTripComponent,
    ProfilePhotoComponent,
    
    
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
  
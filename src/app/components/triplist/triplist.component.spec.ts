import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripListComponent } from './triplist.component';

describe('TriplistComponent', () => {
  let component: TripListComponent;
  let fixture: ComponentFixture<TripListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripListComponent]
    });
    fixture = TestBed.createComponent(TripListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription, debounceTime } from 'rxjs';
import { HousingLocation } from '../housinglocation';
import { HousingLocationComponent } from '../housing-location/housing-location.component';
import { HousingService } from '../housing.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HousingLocationComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  filteredLocationList: HousingLocation[] = [];
  search = new FormControl('');

  private housingLocationList: HousingLocation[] = [];
  private housingService: HousingService = inject(HousingService);
  private searchSubscription: Subscription = new Subscription();

  constructor() {
    this.housingService.getAllHousingLocations()
      .then((housingLocationList: HousingLocation[]) => {
        this.housingLocationList = housingLocationList;
        this.filteredLocationList = housingLocationList;
      });
  }

  ngOnInit(): void {
    this.searchSubscription = this.search.valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => this.filterResults(value));
  };

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  filterResults(text: string | null) {
    if (!text) {
      this.filteredLocationList = this.housingLocationList;
      return;
    }

    this.filteredLocationList = this.housingLocationList.filter(
      housingLocation => housingLocation?.city.toLowerCase().includes(text.toLowerCase())
    );
  }
}

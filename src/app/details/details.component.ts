import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HousingService } from '../housing.service';
import { HousingLocation } from '../housinglocation';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl('')
  });
  housingLocation: HousingLocation | undefined;

  private housingService = inject(HousingService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.housingService.getHousingLocationById(housingLocationId)
      .then(housingLocation => this.housingLocation = housingLocation );
  }

  submitApplication() {
    const { firstName, lastName, email } = this.applyForm.value;
    this.housingService.submitApplication(
      firstName ?? '',
      lastName ?? '',
      email ?? ''
    );
  }

}

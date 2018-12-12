import { NgModule } from '@angular/core';

import { TrainingRoutingModule } from './training-routing.module';
import { TrainingComponent } from './training.component';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingsComponent } from './past-trainings/past-trainings.component';
import { StopTrainingComponent } from './stop-training/stop-training.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    TrainingComponent,
    CurrentTrainingComponent,
    NewTrainingComponent,
    PastTrainingsComponent,
    StopTrainingComponent
  ],
  imports: [
    SharedModule,
    TrainingRoutingModule
  ],
  entryComponents: [
    StopTrainingComponent
  ]
})
export class TrainingModule { }

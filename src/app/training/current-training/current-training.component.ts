import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StopTrainingComponent } from '../stop-training/stop-training.component';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  interval;
  constructor(
    public dialog: MatDialog,
    private trainingService: TrainingService
  ) { }

  startOrResume() {
    const step = this.trainingService.getRunningExercise().duration / 100 * 1000;
    this.interval = setInterval(() => {
      this.progress += 5;
      if (this.progress >= 100) {
        this.trainingService.completeExercise();
        clearInterval(this.interval);
      }
    }, step);
  }

  ngOnInit() {
    this.startOrResume();
  }

  onStop() {
    clearInterval(this.interval);

    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trainingService.cancelExercise(this.progress);
      } else {
        this.startOrResume();
      }
    });
  }
}

import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { Subject, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { UiService } from '../shared/ui.service';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions';
import * as UI from '../shared/ui.actions';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    private store: Store<fromTraining.State>
  ) { }

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading())
    this.fbSubs.push(this.db
      .collection('availableExercies')
      .snapshotChanges()
      .pipe(
        map(res => {
          return res.map((exercise: any) => {
            return {
              id: exercise.payload.doc.id,
              ...exercise.payload.doc.data()
            };
          });
        })
      ).subscribe(
        (exercises: Exercise[]) => {
          this.store.dispatch(new UI.StopLoading())
          this.store.dispatch(new Training.SetAvailableTrainings(exercises))
        },
        error => {
          this.uiService.showSnackbar('Fetching failed, try again later.', null, 3000);
          this.store.dispatch(new UI.StopLoading())
        }
      ));
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId))
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(
      ex => {
        this.addDataToDatabase({
          ...ex,
          date: new Date(),
          state: 'completed'
        });
        this.store.dispatch(new Training.StopTraining())
      }
    )
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(
      ex => {
        this.addDataToDatabase({
          ...ex,
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100),
          date: new Date(),
          state: 'canceled'
        });
        this.store.dispatch(new Training.StopTraining())
      }
    )
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(this.db.collection('finishedExercises').valueChanges().subscribe(
      (exercises: Exercise[]) => {
        this.store.dispatch(new Training.SetFinishedTrainings(exercises))
      }
    ))
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}

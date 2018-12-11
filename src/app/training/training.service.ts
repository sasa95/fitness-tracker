import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { Subject, Subscription } from 'rxjs';
import { FirebaseDatabase, FirebaseFirestore } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private fbSubs: Subscription[] = [];
  constructor(private db: AngularFirestore) { }

  fetchAvailableExercises() {
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
          this.availableExercises = exercises;
          this.exercisesChanged.next([...this.availableExercises]);
        }
      ));
  }

  startExercise(selectedId: string) {
    // this.db.doc('availableExercies/' + selectedId).update({ lastSelected: new Date() })
    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'canceled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(this.db.collection('finishedExercises').valueChanges().subscribe(
      (exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
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

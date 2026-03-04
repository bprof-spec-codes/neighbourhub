import { Injectable } from '@angular/core';
import { TestBackendService } from '../backend/test-backend.service';
import { BehaviorSubject } from 'rxjs';
import { Test } from '../entities/models/test.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class TestService {
  private _testData = new BehaviorSubject<Test[]>([]);
  public testData$ = this._testData.asObservable();


  constructor(private testBackendService: TestBackendService) { }

  public getTests() {
    this.testBackendService.getTests()
      .pipe(untilDestroyed(this))
      .subscribe(res => this._testData.next(res));
  }
}

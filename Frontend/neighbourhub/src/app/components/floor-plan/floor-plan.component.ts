import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, Subscription, switchMap } from 'rxjs';
import { FloorPlanBackendService } from '../../backend/floor-plan-backend.service';
import { FloorPlan } from '../../entities/models/floor-plan.model';
import { PinPoint } from '../../entities/models/pin-point.model';

type FloorPlanViewModel = FloorPlan & {
  imageObjectUrl: string | null;
};

@Component({
  selector: 'app-floor-plan',
  standalone: false,
  templateUrl: './floor-plan.component.html',
  styleUrl: './floor-plan.component.scss'
})
export class FloorPlanComponent implements OnInit, OnDestroy {
  protected floorPlans: FloorPlanViewModel[] = [];
  protected isLoading = false;
  protected errorMessage = '';
  protected activePinPointId: string | null = null;

  private loadSubscription?: Subscription;
  private readonly createdObjectUrls: string[] = [];

  constructor(private floorPlanBackendService: FloorPlanBackendService) {}

  ngOnInit(): void {
    this.loadFloorPlans();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.revokeCreatedObjectUrls();
  }

  protected trackByFloorPlanId(_: number, floorPlan: FloorPlanViewModel): string {
    return floorPlan.id;
  }

  protected trackByPinPointId(_: number, pinPoint: PinPoint): string {
    return pinPoint.id;
  }

  protected isPinPointActive(pinPointId: string): boolean {
    return this.activePinPointId === pinPointId;
  }

  protected togglePinPoint(pinPointId: string): void {
    this.activePinPointId = this.activePinPointId === pinPointId ? null : pinPointId;
  }

  protected closePinPoint(event?: MouseEvent): void {
    event?.stopPropagation();
    this.activePinPointId = null;
  }

  private loadFloorPlans(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.revokeCreatedObjectUrls();

    this.loadSubscription = this.floorPlanBackendService.getFloorPlans().pipe(
      switchMap((floorPlans) => {
        if (floorPlans.length === 0) {
          return of([] as FloorPlanViewModel[]);
        }

        return forkJoin(floorPlans.map((floorPlan) => this.loadFloorPlanImage(floorPlan)));
      })
    ).subscribe({
      next: (floorPlans) => {
        this.floorPlans = floorPlans;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load floor plans', error);
        this.errorMessage = 'A floor planok betoltese nem sikerult.';
        this.isLoading = false;
      }
    });
  }

  private loadFloorPlanImage(floorPlan: FloorPlan): Observable<FloorPlanViewModel> {
    return this.floorPlanBackendService.getFloorPlanImage(floorPlan.id).pipe(
      map((blob) => ({
        ...floorPlan,
        imageObjectUrl: this.createObjectUrl(blob)
      })),
      catchError((error) => {
        console.error(`Failed to load floor plan image for floor plan ${floorPlan.id}`, error);
        return of({
          ...floorPlan,
          imageObjectUrl: null
        });
      })
    );
  }

  private createObjectUrl(blob: Blob): string {
    const objectUrl = window.URL.createObjectURL(blob);
    this.createdObjectUrls.push(objectUrl);
    return objectUrl;
  }

  private revokeCreatedObjectUrls(): void {
    for (const objectUrl of this.createdObjectUrls) {
      window.URL.revokeObjectURL(objectUrl);
    }

    this.createdObjectUrls.length = 0;
  }
}

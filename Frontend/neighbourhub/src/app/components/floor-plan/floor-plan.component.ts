import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, Subscription, switchMap } from 'rxjs';
import { FloorPlanBackendService } from '../../backend/floor-plan-backend.service';
import { AuthService } from '../../services/auth.service';
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
  protected placingPinPointFloorPlanId: string | null = null;
  protected isAddPinPointModalOpen = false;
  protected addPinPointTitle = '';

  protected pendingPinPointPlacement: {
    floorPlanId: string;
    latitude: number;
    longitude: number;
  } | null = null;

  private loadSubscription?: Subscription;
  private readonly createdObjectUrls: string[] = [];

  constructor(
    private floorPlanBackendService: FloorPlanBackendService,
    private authService: AuthService
  ) {}

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

  protected isPlacingPinPointForFloorPlan(floorPlanId: string): boolean {
    return this.placingPinPointFloorPlanId === floorPlanId;
  }

  protected togglePinPointPlacement(floorPlanId: string, event?: MouseEvent): void {
    event?.stopPropagation();
    this.activePinPointId = null;
    this.placingPinPointFloorPlanId = this.placingPinPointFloorPlanId === floorPlanId ? null : floorPlanId;
  }

  protected onFloorPlanImageClick(floorPlan: FloorPlanViewModel, event: MouseEvent): void {
    if (!this.isPlacingPinPointForFloorPlan(floorPlan.id)) {
      return;
    }

    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const rect = target.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }

    const latitude = Number((((event.clientX - rect.left) / rect.width) * 100).toFixed(2));
    const longitude = Number((((event.clientY - rect.top) / rect.height) * 100).toFixed(2));

    this.pendingPinPointPlacement = {
      floorPlanId: floorPlan.id,
      latitude,
      longitude
    };
    this.addPinPointTitle = '';
    this.isAddPinPointModalOpen = true;
  }

  protected isPinPointActive(pinPointId: string): boolean {
    return this.activePinPointId === pinPointId;
  }

  protected togglePinPoint(pinPointId: string, event?: MouseEvent): void {
    event?.stopPropagation();
    this.activePinPointId = this.activePinPointId === pinPointId ? null : pinPointId;
  }

  protected closePinPoint(event?: MouseEvent): void {
    event?.stopPropagation();
    this.activePinPointId = null;
  }

  protected closeAddPinPointModal(): void {
    this.isAddPinPointModalOpen = false;
    this.addPinPointTitle = '';
    this.pendingPinPointPlacement = null;
  }

  protected savePinPoint(): void {
    if (!this.pendingPinPointPlacement) {
      return;
    }

    const title = this.addPinPointTitle.trim();
    if (!title) {
      return;
    }

    this.floorPlanBackendService.addPinPoint({
      floorPlanId: this.pendingPinPointPlacement.floorPlanId,
      title,
      latitude: this.pendingPinPointPlacement.latitude,
      longitude: this.pendingPinPointPlacement.longitude
    }).subscribe({
      next: () => {
        this.closeAddPinPointModal();
        this.placingPinPointFloorPlanId = null;
        this.activePinPointId = null;
        this.loadFloorPlans();
      },
      error: (error) => {
        console.error(`Failed to add pin point to floor plan ${this.pendingPinPointPlacement?.floorPlanId}`, error);
      }
    });
  }

  protected deletePinPoint(pinPointId: string, event?: MouseEvent): void {
    event?.stopPropagation();

    this.floorPlanBackendService.deletePinPoint(pinPointId).subscribe({
      next: () => {
        if (this.activePinPointId === pinPointId) {
          this.activePinPointId = null;
        }

        this.loadFloorPlans();
      },
      error: (error) => {
        console.error(`Failed to delete pin point ${pinPointId}`, error);
      }
    });
  }

  protected isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  private loadFloorPlans(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.revokeCreatedObjectUrls();
    this.loadSubscription?.unsubscribe();

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

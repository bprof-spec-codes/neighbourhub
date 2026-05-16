import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FloorPlanService, FloorPlanViewModel } from '../../services/floor-plan.service';
import { PinPoint } from '../../entities/models/pin-point.model';

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
  protected isUploadingFloorPlan = false;
  protected activePinPointId: string | null = null;
  protected placingPinPointFloorPlanId: string | null = null;
  protected isAddFloorPlanModalOpen = false;
  protected isAddPinPointModalOpen = false;
  protected addFloorPlanNumber: number | null = null;
  protected addFloorPlanImageFile: File | null = null;
  protected addFloorPlanImageFileName = '';
  protected addPinPointTitle = '';

  protected pendingPinPointPlacement: {
    floorPlanId: string;
    latitude: number;
    longitude: number;
  } | null = null;

  private loadSubscription?: Subscription;

  constructor(
    private floorPlanService: FloorPlanService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFloorPlans();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.floorPlanService.dispose();
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

  protected openAddFloorPlanModal(): void {
    this.isAddFloorPlanModalOpen = true;
    this.addFloorPlanNumber = null;
    this.addFloorPlanImageFile = null;
    this.addFloorPlanImageFileName = '';
  }

  protected closeAddFloorPlanModal(): void {
    this.isAddFloorPlanModalOpen = false;
    this.addFloorPlanNumber = null;
    this.addFloorPlanImageFile = null;
    this.addFloorPlanImageFileName = '';
  }

  protected deleteFloorPlan(floorPlanId: string, event?: MouseEvent): void {
    event?.stopPropagation();

    this.floorPlanService.deleteFloorPlan(floorPlanId).subscribe({
      next: () => {
        if (this.placingPinPointFloorPlanId === floorPlanId) {
          this.placingPinPointFloorPlanId = null;
        }

        this.activePinPointId = null;
        this.loadFloorPlans();
      },
      error: (error) => {
        console.error(`Failed to delete floor plan ${floorPlanId}`, error);
      }
    });
  }

  protected onAddFloorPlanFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.addFloorPlanImageFile = file;
    this.addFloorPlanImageFileName = file?.name ?? '';
  }

  protected saveFloorPlan(): void {
    if (!this.isAdmin() || this.addFloorPlanNumber === null || !this.addFloorPlanImageFile) {
      return;
    }

    this.isUploadingFloorPlan = true;

    this.floorPlanService.uploadFloorPlan(this.addFloorPlanNumber, this.addFloorPlanImageFile).subscribe({
      next: () => {
        this.isUploadingFloorPlan = false;
        this.closeAddFloorPlanModal();
        this.loadFloorPlans();
      },
      error: (error) => {
        this.isUploadingFloorPlan = false;
        console.error('Failed to upload floor plan', error);
      }
    });
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

    this.floorPlanService.addPinPoint({
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

    this.floorPlanService.deletePinPoint(pinPointId).subscribe({
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
    this.loadSubscription?.unsubscribe();

    this.loadSubscription = this.floorPlanService.loadFloorPlans().subscribe({
      next: (floorPlans) => {
        this.floorPlans = floorPlans;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load floor plans', error);
        this.errorMessage = 'Failed to load floor plans.';
        this.isLoading = false;
      }
    });
  }
}

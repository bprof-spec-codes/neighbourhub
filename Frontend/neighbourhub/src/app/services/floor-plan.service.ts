import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { FloorPlanBackendService } from '../backend/floor-plan-backend.service';
import { PinPointAddDto } from '../entities/dtos/pin-point-add-dto.model';
import { FloorPlan } from '../entities/models/floor-plan.model';
import { PinPoint } from '../entities/models/pin-point.model';

export type FloorPlanViewModel = FloorPlan & {
	imageObjectUrl: string | null;
};

@Injectable({
	providedIn: 'root'
})
export class FloorPlanService {
	private readonly createdObjectUrls: string[] = [];

	constructor(private floorPlanBackendService: FloorPlanBackendService) {}

	public loadFloorPlans(): Observable<FloorPlanViewModel[]> {
		this.revokeCreatedObjectUrls();

		return this.floorPlanBackendService.getFloorPlans().pipe(
			switchMap((floorPlans) => {
				if (floorPlans.length === 0) {
					return of([] as FloorPlanViewModel[]);
				}

				return forkJoin(floorPlans.map((floorPlan) => this.loadFloorPlanImage(floorPlan)));
			})
		);
	}

	public uploadFloorPlan(floor: number, image: File): Observable<void> {
		return this.floorPlanBackendService.uploadFloorPlan(floor, image);
	}

	public deleteFloorPlan(floorPlanId: string): Observable<void> {
		return this.floorPlanBackendService.deleteFloorPlan(floorPlanId);
	}

	public addPinPoint(dto: PinPointAddDto): Observable<void> {
		return this.floorPlanBackendService.addPinPoint(dto);
	}

	public deletePinPoint(pinPointId: string): Observable<void> {
		return this.floorPlanBackendService.deletePinPoint(pinPointId);
	}

	public dispose(): void {
		this.revokeCreatedObjectUrls();
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
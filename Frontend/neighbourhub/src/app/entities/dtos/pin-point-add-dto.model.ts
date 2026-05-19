export class PinPointAddDto {
	constructor(
		public latitude: number,
		public longitude: number,
		public title: string,
		public floorPlanId: string
	) {}
}

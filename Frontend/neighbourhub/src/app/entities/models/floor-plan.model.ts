import { PinPoint } from './pin-point.model';

export class FloorPlan {
  constructor(
    public id: string,
    public floor: number,
    public imageUrl: string,
    public pinPoints: PinPoint[]
  ) {}
}
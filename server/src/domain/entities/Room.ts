import { Entity } from './Entity';
import { RoomStatus } from '../enums/RoomStatus';

export class Room extends Entity {
  constructor(
    id: string,
    public name: string,
    public capacity: number,
    public amenities: string[],
    private _status: RoomStatus
  ) {
    super(id);
  }

  get status(): RoomStatus {
    return this._status;
  }

  isAvailable(): boolean {
    return this._status === RoomStatus.AVAILABLE;
  }

  markAsOccupied(): void {
    this._status = RoomStatus.OCCUPIED;
  }

  markAsAvailable(): void {
    this._status = RoomStatus.AVAILABLE;
  }

  setMaintenance(): void {
    this._status = RoomStatus.MAINTENANCE;
  }

  hasAmenity(amenity: string): boolean {
    return this.amenities.includes(amenity);
  }
}

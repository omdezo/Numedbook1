import { IRepository } from './IRepository';
import { Room } from '../domain/entities/Room';
import { RoomStatus } from '../domain/enums/RoomStatus';
import { v4 as uuidv4 } from 'uuid';

export class RoomRepository implements IRepository<Room> {
  private rooms: Map<string, Room> = new Map();

  constructor() {
    // Initialize with 5 rooms
    this.seedRooms();
  }

  private seedRooms(): void {
    const roomsData = [
      { name: 'Room A', capacity: 3, amenities: ['Table', 'Chairs', 'WiFi'] },
      { name: 'Room B', capacity: 3, amenities: ['Table', 'Chairs', 'WiFi'] },
      { name: 'Room C', capacity: 3, amenities: ['Table', 'Chairs', 'WiFi'] },
      { name: 'Room D', capacity: 3, amenities: ['Table', 'Chairs', 'WiFi'] },
      { name: 'Room E', capacity: 3, amenities: ['Table', 'Chairs', 'WiFi'] }
    ];

    roomsData.forEach(data => {
      const room = new Room(
        uuidv4(),
        data.name,
        data.capacity,
        data.amenities,
        RoomStatus.AVAILABLE
      );
      this.rooms.set(room.id, room);
    });
  }

  async findById(id: string): Promise<Room | null> {
    return this.rooms.get(id) || null;
  }

  async findAll(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }

  async save(room: Room): Promise<Room> {
    this.rooms.set(room.id, room);
    return room;
  }

  async delete(id: string): Promise<void> {
    this.rooms.delete(id);
  }
}

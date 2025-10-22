import { IRepository } from './IRepository';
import { Room } from '../domain/entities/Room';
import { RoomStatus } from '../domain/enums/RoomStatus';
import { v4 as uuidv4 } from 'uuid';

export class RoomRepository implements IRepository<Room> {
  private rooms: Map<string, Room> = new Map();

  constructor() {
    // Initialize with 4 rooms
    this.seedRooms();
  }

  private seedRooms(): void {
    const roomsData = [
      { name: 'Room A', capacity: 4, amenities: ['Whiteboard', 'Projector', 'WiFi'] },
      { name: 'Room B', capacity: 6, amenities: ['Whiteboard', 'TV Screen', 'WiFi'] },
      { name: 'Room C', capacity: 8, amenities: ['Whiteboard', 'Projector', 'WiFi', 'Video Conference'] },
      { name: 'Room D', capacity: 10, amenities: ['Whiteboard', 'Projector', 'WiFi', 'Video Conference', 'Sound System'] }
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

import { Room } from '../domain/entities/Room';
import { RoomRepository } from '../repositories/RoomRepository';

export class RoomService {
  constructor(private readonly roomRepository: RoomRepository) {}

  async getAllRooms(): Promise<Room[]> {
    return await this.roomRepository.findAll();
  }

  async getRoomById(id: string): Promise<Room | null> {
    return await this.roomRepository.findById(id);
  }
}

import { Router } from 'express';
import { RoomController } from '../controllers/RoomController';

export function createRoomRoutes(controller: RoomController): Router {
  const router = Router();

  router.get('/', (req, res) => controller.getAllRooms(req, res));
  router.get('/:id', (req, res) => controller.getRoomById(req, res));
  router.get('/:id/availability', (req, res) => controller.getAvailableSlots(req, res));

  return router;
}

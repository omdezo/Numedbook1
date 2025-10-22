import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';

export function createBookingRoutes(controller: BookingController): Router {
  const router = Router();

  router.post('/', (req, res) => controller.createBooking(req, res));
  router.get('/', (req, res) => controller.getAllBookings(req, res));
  router.get('/user', (req, res) => controller.getUserBookings(req, res));
  router.delete('/:id', (req, res) => controller.cancelBooking(req, res));

  return router;
}

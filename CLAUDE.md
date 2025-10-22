# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A high-performance study room booking system managing 4 study rooms with real-time availability, optimized for speed and exceptional UI/UX. Built with React + TypeScript (frontend) and Node.js + TypeScript (backend).

## System Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite (with OOP patterns)
- **Styling**: TailwindCSS + shadcn/ui components
- **State Management**: Zustand (lightweight, fast) + TanStack Query (server state)
- **Backend**: Fastify + TypeScript (faster than Express) with OOP architecture
- **Database**: PostgreSQL + Prisma ORM
- **Real-time**: WebSocket (Socket.io) for live room status updates
- **Validation**: Zod (shared between frontend/backend)
- **Testing**: Vitest (frontend), Jest (backend)
- **Design Patterns**: Repository, Service Layer, Factory, Strategy, Observer (for real-time updates)

### OOP Design Principles

**Backend follows SOLID principles:**
- **Single Responsibility**: Each class has one clear purpose
- **Open/Closed**: Extend behavior via inheritance, not modification
- **Liskov Substitution**: Derived classes are substitutable for base classes
- **Interface Segregation**: Small, focused interfaces
- **Dependency Inversion**: Depend on abstractions, not concrete implementations

**Frontend OOP approach:**
- Class-based services and utilities
- Custom hooks encapsulate business logic
- Component composition over inheritance
- State management through class instances

### Core Domain Models (OOP Classes)

```typescript
// Domain Entities (classes with behavior)

enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance'
}

enum BookingStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin'
}

// Base Entity class
abstract class Entity {
  constructor(public readonly id: string) {}

  equals(other: Entity): boolean {
    return this.id === other.id;
  }
}

// Room Entity
class Room extends Entity {
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

// Booking Entity
class Booking extends Entity {
  constructor(
    id: string,
    public readonly roomId: string,
    public readonly userId: string,
    public readonly startTime: Date,
    public readonly endTime: Date,
    private _status: BookingStatus,
    public readonly createdAt: Date = new Date()
  ) {
    super(id);
    this.validate();
  }

  private validate(): void {
    if (this.endTime <= this.startTime) {
      throw new Error('End time must be after start time');
    }

    const durationHours = this.getDurationHours();
    if (durationHours !== 1 && durationHours !== 2) {
      throw new Error('Booking must be 1 or 2 hours');
    }

    const startHour = this.startTime.getHours();
    if (startHour < 7 || startHour >= 21) {
      throw new Error('Bookings only available between 7 AM and 9 PM');
    }
  }

  get status(): BookingStatus {
    return this._status;
  }

  getDurationHours(): number {
    return (this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60 * 60);
  }

  isActive(): boolean {
    return this._status === BookingStatus.ACTIVE;
  }

  cancel(): void {
    if (this._status !== BookingStatus.ACTIVE) {
      throw new Error('Only active bookings can be cancelled');
    }
    this._status = BookingStatus.CANCELLED;
  }

  complete(): void {
    if (this._status !== BookingStatus.ACTIVE) {
      throw new Error('Only active bookings can be completed');
    }
    this._status = BookingStatus.COMPLETED;
  }

  canExtend(): boolean {
    return this.getDurationHours() === 1 && this.isActive();
  }

  conflictsWith(other: Booking): boolean {
    return (
      this.roomId === other.roomId &&
      this.startTime < other.endTime &&
      this.endTime > other.startTime
    );
  }
}

// User Entity
class User extends Entity {
  constructor(
    id: string,
    public name: string,
    public email: string,
    public readonly role: UserRole
  ) {
    super(id);
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isStudent(): boolean {
    return this.role === UserRole.STUDENT;
  }
}

// TimeSlot Value Object (immutable)
class TimeSlot {
  constructor(
    public readonly startHour: number,
    public readonly endHour: number,
    public readonly isAvailable: boolean
  ) {
    if (startHour < 7 || startHour > 20) {
      throw new Error('Start hour must be between 7 and 20');
    }
    if (endHour !== startHour + 1) {
      throw new Error('Time slot must be exactly 1 hour');
    }
  }

  get displayLabel(): string {
    const startAMPM = this.startHour < 12 ? 'AM' : 'PM';
    const endAMPM = this.endHour < 12 ? 'AM' : 'PM';
    const startDisplay = this.startHour > 12 ? this.startHour - 12 : this.startHour;
    const endDisplay = this.endHour > 12 ? this.endHour - 12 : this.endHour;
    return `${startDisplay}:00 ${startAMPM} - ${endDisplay}:00 ${endAMPM}`;
  }

  toDateRange(date: Date): { start: Date; end: Date } {
    const start = new Date(date);
    start.setHours(this.startHour, 0, 0, 0);
    const end = new Date(date);
    end.setHours(this.endHour, 0, 0, 0);
    return { start, end };
  }
}
```

## Frontend Architecture

### Project Structure (OOP-Based)
```
src/
├── domain/              # Domain layer (OOP entities)
│   ├── entities/
│   │   ├── Room.ts
│   │   ├── Booking.ts
│   │   ├── User.ts
│   │   └── Entity.ts (base class)
│   ├── value-objects/
│   │   └── TimeSlot.ts
│   └── enums/
│       ├── RoomStatus.ts
│       ├── BookingStatus.ts
│       └── UserRole.ts
├── services/            # Business logic services (class-based)
│   ├── RoomService.ts
│   ├── BookingService.ts
│   ├── ValidationService.ts
│   ├── NotificationService.ts
│   └── BaseService.ts
├── repositories/        # Data access layer (Repository pattern)
│   ├── RoomRepository.ts
│   ├── BookingRepository.ts
│   ├── UserRepository.ts
│   └── IRepository.ts (interface)
├── factories/           # Factory pattern for creating entities
│   ├── RoomFactory.ts
│   ├── BookingFactory.ts
│   └── TimeSlotFactory.ts
├── components/
│   ├── ui/              # shadcn/ui primitives (Button, Card, Dialog)
│   ├── rooms/           # Room-specific components
│   │   ├── RoomCard.tsx
│   │   ├── RoomGrid.tsx
│   │   └── RoomStatus.tsx
│   ├── booking/
│   │   ├── BookingForm.tsx
│   │   ├── BookingCalendar.tsx
│   │   └── TimeSlotPicker.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Sidebar.tsx
├── hooks/               # Custom hooks using services
│   ├── useRoom.ts
│   ├── useBooking.ts
│   └── useWebSocket.ts
├── stores/              # Zustand stores (class instances)
│   ├── RoomStore.ts
│   ├── BookingStore.ts
│   └── UserStore.ts
├── lib/
│   ├── ApiClient.ts    # API client class
│   ├── WebSocketManager.ts  # WebSocket manager class
│   └── utils.ts
├── types/              # Interfaces and types
│   ├── interfaces/
│   └── dto/            # Data Transfer Objects
└── App.tsx
```

### Component Design Patterns

**Performance Optimizations:**
- Use `React.memo()` for expensive components (RoomCard, BookingCalendar)
- Virtualize lists if showing many bookings (react-window)
- Lazy load routes with `React.lazy()`
- Debounce search inputs
- Use `useMemo()` and `useCallback()` strategically

**State Management Strategy:**
- **Zustand** for UI state (modal open/close, filters, view mode)
- **TanStack Query** for server data (automatic caching, background refetch)
- **WebSocket** for real-time room status (push updates to Zustand store)

### Key User Flows

1. **View Available Rooms**
   - Grid view showing all 4 rooms with real-time status
   - Filter by capacity, amenities, time range
   - Color-coded status indicators (green/red/yellow)

2. **Book a Room**
   - Click room card → Opens booking modal
   - Select date & time slot (1-hour intervals, 7 AM - 9 PM)
   - Visual conflict detection (grayed out unavailable slots)
   - Optimistic UI updates + rollback on failure
   - Instant confirmation with booking details

3. **Manage Bookings**
   - User dashboard with upcoming bookings
   - One-click cancellation with confirmation
   - Extend booking from 1 hour to 2 hours if next slot is available (only if total doesn't exceed 2 hours)

4. **Real-time Updates**
   - WebSocket connection shows live room status
   - Toast notifications for booking conflicts
   - Auto-refresh calendar when booking changes

## Backend Architecture (OOP-Based)

### API Structure
```
src/
├── domain/              # Domain layer (shared with frontend)
│   ├── entities/
│   │   ├── Room.ts
│   │   ├── Booking.ts
│   │   ├── User.ts
│   │   └── Entity.ts (abstract base)
│   ├── value-objects/
│   │   └── TimeSlot.ts
│   └── enums/
│       ├── RoomStatus.ts
│       ├── BookingStatus.ts
│       └── UserRole.ts
├── controllers/         # HTTP controllers (handle requests/responses)
│   ├── RoomController.ts
│   ├── BookingController.ts
│   ├── UserController.ts
│   └── BaseController.ts
├── services/            # Business logic (Service Layer pattern)
│   ├── RoomService.ts
│   ├── BookingService.ts
│   ├── UserService.ts
│   ├── ValidationService.ts
│   ├── NotificationService.ts
│   └── IService.ts (interface)
├── repositories/        # Repository pattern (data access)
│   ├── RoomRepository.ts
│   ├── BookingRepository.ts
│   ├── UserRepository.ts
│   ├── BaseRepository.ts
│   └── IRepository.ts (interface)
├── factories/           # Factory pattern
│   ├── RoomFactory.ts
│   ├── BookingFactory.ts
│   └── EntityFactory.ts
├── strategies/          # Strategy pattern (for different booking rules)
│   ├── BookingValidationStrategy.ts
│   ├── PricingStrategy.ts (future)
│   └── IStrategy.ts
├── observers/           # Observer pattern (real-time updates)
│   ├── BookingObserver.ts
│   ├── RoomStatusObserver.ts
│   └── IObserver.ts
├── middleware/
│   ├── AuthMiddleware.ts
│   ├── ValidationMiddleware.ts
│   ├── ErrorHandlerMiddleware.ts
│   └── BaseMiddleware.ts
├── routes/
│   ├── roomRoutes.ts
│   ├── bookingRoutes.ts
│   ├── userRoutes.ts
│   └── index.ts
├── websocket/
│   ├── WebSocketManager.ts
│   ├── RoomStatusHandler.ts
│   └── IWebSocketHandler.ts
├── prisma/
│   └── schema.prisma
├── types/
│   ├── interfaces/
│   └── dto/            # Data Transfer Objects
├── config/
│   └── DatabaseConfig.ts
└── server.ts
```

### API Endpoints

**Rooms**
- `GET /api/rooms` - List all rooms with current status
- `GET /api/rooms/:id` - Get room details
- `GET /api/rooms/:id/availability?date=YYYY-MM-DD` - Get available time slots for a specific date
  - Returns 14 hourly slots: 7-8 AM, 8-9 AM, 9-10 AM, 10-11 AM, 11 AM-12 PM, 12-1 PM, 1-2 PM, 2-3 PM, 3-4 PM, 4-5 PM, 5-6 PM, 6-7 PM, 7-8 PM, 8-9 PM
  - Each slot marked as available/booked
  - Only returns slots for dates at least 1 day in advance

**Bookings**
- `GET /api/bookings` - List user's bookings (query: ?status=active&from=DATE)
- `POST /api/bookings` - Create booking (validates conflicts, 1-day advance requirement, max 2 hours)
- `DELETE /api/bookings/:id` - Cancel booking
- `PATCH /api/bookings/:id/extend` - Extend booking by 1 hour (only if current booking is 1 hour and next slot is available)

**Users**
- `GET /api/users/me` - Get current user info
- `POST /api/auth/login` - Authenticate user

### OOP Implementation Examples

**Repository Pattern (Data Access Layer):**
```typescript
// IRepository.ts - Base interface
interface IRepository<T extends Entity> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

// BaseRepository.ts - Abstract base repository
abstract class BaseRepository<T extends Entity> implements IRepository<T> {
  constructor(protected readonly prisma: PrismaClient) {}

  abstract findById(id: string): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract save(entity: T): Promise<T>;
  abstract delete(id: string): Promise<void>;
}

// BookingRepository.ts - Concrete implementation
class BookingRepository extends BaseRepository<Booking> {
  async findById(id: string): Promise<Booking | null> {
    const data = await this.prisma.booking.findUnique({ where: { id } });
    return data ? BookingFactory.fromPrisma(data) : null;
  }

  async findAll(): Promise<Booking[]> {
    const data = await this.prisma.booking.findMany();
    return data.map(BookingFactory.fromPrisma);
  }

  async findByRoomAndDateRange(roomId: string, start: Date, end: Date): Promise<Booking[]> {
    const data = await this.prisma.booking.findMany({
      where: {
        roomId,
        status: BookingStatus.ACTIVE,
        OR: [
          { startTime: { lt: end }, endTime: { gt: start } }
        ]
      }
    });
    return data.map(BookingFactory.fromPrisma);
  }

  async save(booking: Booking): Promise<Booking> {
    const data = await this.prisma.booking.upsert({
      where: { id: booking.id },
      update: BookingFactory.toPrisma(booking),
      create: BookingFactory.toPrisma(booking)
    });
    return BookingFactory.fromPrisma(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.booking.delete({ where: { id } });
  }
}
```

**Service Layer Pattern (Business Logic):**
```typescript
// IService.ts - Base interface
interface IService {
  // Common service methods
}

// BookingService.ts - Business logic
class BookingService implements IService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly roomRepository: RoomRepository,
    private readonly validationService: ValidationService,
    private readonly notificationService: NotificationService
  ) {}

  async createBooking(
    userId: string,
    roomId: string,
    startTime: Date,
    endTime: Date
  ): Promise<Booking> {
    // Validation
    await this.validationService.validateBookingRules(userId, startTime, endTime);

    // Check conflicts
    const conflicts = await this.bookingRepository.findByRoomAndDateRange(
      roomId,
      startTime,
      endTime
    );

    if (conflicts.length > 0) {
      throw new Error('Time slot already booked');
    }

    // Create booking entity
    const booking = new Booking(
      crypto.randomUUID(),
      roomId,
      userId,
      startTime,
      endTime,
      BookingStatus.ACTIVE
    );

    // Save to database
    const savedBooking = await this.bookingRepository.save(booking);

    // Update room status
    const room = await this.roomRepository.findById(roomId);
    if (room) {
      room.markAsOccupied();
      await this.roomRepository.save(room);
    }

    // Notify observers (WebSocket)
    await this.notificationService.notifyBookingCreated(savedBooking);

    return savedBooking;
  }

  async cancelBooking(bookingId: string, userId: string): Promise<void> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new Error('Unauthorized');
    }

    // Use entity method
    booking.cancel();

    await this.bookingRepository.save(booking);

    // Update room availability
    await this.updateRoomAvailability(booking.roomId);

    // Notify observers
    await this.notificationService.notifyBookingCancelled(booking);
  }

  async extendBooking(bookingId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (!booking.canExtend()) {
      throw new Error('Booking cannot be extended');
    }

    const newEndTime = new Date(booking.endTime);
    newEndTime.setHours(newEndTime.getHours() + 1);

    // Check if next slot is available
    const conflicts = await this.bookingRepository.findByRoomAndDateRange(
      booking.roomId,
      booking.endTime,
      newEndTime
    );

    if (conflicts.length > 0) {
      throw new Error('Next time slot is not available');
    }

    // Create new extended booking
    const extendedBooking = new Booking(
      booking.id,
      booking.roomId,
      booking.userId,
      booking.startTime,
      newEndTime,
      booking.status,
      booking.createdAt
    );

    return await this.bookingRepository.save(extendedBooking);
  }

  private async updateRoomAvailability(roomId: string): Promise<void> {
    const now = new Date();
    const activeBookings = await this.bookingRepository.findByRoomAndDateRange(
      roomId,
      now,
      new Date(now.getTime() + 24 * 60 * 60 * 1000)
    );

    const room = await this.roomRepository.findById(roomId);
    if (room) {
      if (activeBookings.length === 0) {
        room.markAsAvailable();
      } else {
        room.markAsOccupied();
      }
      await this.roomRepository.save(room);
    }
  }
}
```

**Controller Pattern (HTTP Handlers):**
```typescript
// BaseController.ts
abstract class BaseController {
  protected sendSuccess<T>(reply: any, data: T, statusCode = 200) {
    return reply.code(statusCode).send({ success: true, data });
  }

  protected sendError(reply: any, message: string, statusCode = 400) {
    return reply.code(statusCode).send({ success: false, error: message });
  }
}

// BookingController.ts
class BookingController extends BaseController {
  constructor(private readonly bookingService: BookingService) {
    super();
  }

  async createBooking(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { roomId, startTime, endTime } = request.body as any;
      const userId = (request.user as any).id;

      const booking = await this.bookingService.createBooking(
        userId,
        roomId,
        new Date(startTime),
        new Date(endTime)
      );

      return this.sendSuccess(reply, booking, 201);
    } catch (error: any) {
      return this.sendError(reply, error.message, 400);
    }
  }

  async cancelBooking(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;
      const userId = (request.user as any).id;

      await this.bookingService.cancelBooking(id, userId);

      return this.sendSuccess(reply, { message: 'Booking cancelled' });
    } catch (error: any) {
      return this.sendError(reply, error.message, 400);
    }
  }

  async extendBooking(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as any;

      const booking = await this.bookingService.extendBooking(id);

      return this.sendSuccess(reply, booking);
    } catch (error: any) {
      return this.sendError(reply, error.message, 400);
    }
  }
}
```

**Observer Pattern (Real-time Updates):**
```typescript
// IObserver.ts
interface IObserver {
  update(data: any): void;
}

// BookingObserver.ts
class BookingObserver implements IObserver {
  constructor(private readonly webSocketManager: WebSocketManager) {}

  update(booking: Booking): void {
    this.webSocketManager.broadcast('booking:changed', {
      bookingId: booking.id,
      roomId: booking.roomId,
      status: booking.status,
      timestamp: new Date()
    });
  }
}

// RoomStatusObserver.ts
class RoomStatusObserver implements IObserver {
  constructor(private readonly webSocketManager: WebSocketManager) {}

  update(room: Room): void {
    this.webSocketManager.broadcast('room:status:changed', {
      roomId: room.id,
      status: room.status,
      timestamp: new Date()
    });
  }
}

// NotificationService.ts - Subject that manages observers
class NotificationService {
  private observers: IObserver[] = [];

  attach(observer: IObserver): void {
    this.observers.push(observer);
  }

  detach(observer: IObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  private notify(data: any): void {
    for (const observer of this.observers) {
      observer.update(data);
    }
  }

  async notifyBookingCreated(booking: Booking): Promise<void> {
    this.notify(booking);
  }

  async notifyBookingCancelled(booking: Booking): Promise<void> {
    this.notify(booking);
  }
}
```

**Factory Pattern:**
```typescript
// BookingFactory.ts
class BookingFactory {
  static fromPrisma(data: any): Booking {
    return new Booking(
      data.id,
      data.roomId,
      data.userId,
      data.startTime,
      data.endTime,
      data.status as BookingStatus,
      data.createdAt
    );
  }

  static toPrisma(booking: Booking): any {
    return {
      id: booking.id,
      roomId: booking.roomId,
      userId: booking.userId,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      createdAt: booking.createdAt
    };
  }

  static create(
    userId: string,
    roomId: string,
    startTime: Date,
    endTime: Date
  ): Booking {
    return new Booking(
      crypto.randomUUID(),
      roomId,
      userId,
      startTime,
      endTime,
      BookingStatus.ACTIVE
    );
  }
}

// TimeSlotFactory.ts
class TimeSlotFactory {
  static generateDailySlots(date: Date, bookedSlots: Booking[]): TimeSlot[] {
    const slots: TimeSlot[] = [];

    for (let hour = 7; hour < 21; hour++) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(date);
      slotEnd.setHours(hour + 1, 0, 0, 0);

      const isBooked = bookedSlots.some(booking =>
        booking.startTime <= slotStart && booking.endTime > slotStart
      );

      slots.push(new TimeSlot(hour, hour + 1, !isBooked));
    }

    return slots;
  }
}
```

**Strategy Pattern (Validation):**
```typescript
// IStrategy.ts
interface IValidationStrategy {
  validate(data: any): void;
}

// BookingValidationStrategy.ts
class BookingTimeValidationStrategy implements IValidationStrategy {
  validate(booking: { startTime: Date; endTime: Date }): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (booking.startTime < tomorrow) {
      throw new Error('Must book at least 1 day in advance');
    }

    const hour = booking.startTime.getHours();
    if (hour < 7 || hour >= 21) {
      throw new Error('Bookings only available between 7 AM and 9 PM');
    }
  }
}

class BookingDurationValidationStrategy implements IValidationStrategy {
  validate(booking: { startTime: Date; endTime: Date }): void {
    const duration = (booking.endTime.getTime() - booking.startTime.getTime()) / (1000 * 60 * 60);
    if (duration !== 1 && duration !== 2) {
      throw new Error('Booking must be 1 or 2 hours');
    }
  }
}

// ValidationService.ts
class ValidationService {
  private strategies: IValidationStrategy[] = [];

  constructor() {
    this.strategies.push(new BookingTimeValidationStrategy());
    this.strategies.push(new BookingDurationValidationStrategy());
  }

  async validateBookingRules(userId: string, startTime: Date, endTime: Date): Promise<void> {
    const bookingData = { startTime, endTime };

    for (const strategy of this.strategies) {
      strategy.validate(bookingData);
    }

    // Additional validation: max 2 active bookings per user
    // (Would require repository injection)
  }
}
```

**Booking Rules:**
- Time slots: 1-hour intervals only (7 AM, 8 AM, 9 AM, ..., 8 PM)
- Operating hours: 7:00 AM to 9:00 PM daily (14 available slots)
- Maximum booking: 2 consecutive slots (2 hours maximum)
- Minimum advance booking: Must book at least 1 day before
- Maximum 2 active bookings per user
- Auto-cancellation if user doesn't check in within 15 minutes of start time

### Dependency Injection & Service Container

```typescript
// Container.ts - Simple DI container
class Container {
  private services = new Map<string, any>();

  register<T>(key: string, factory: () => T): void {
    this.services.set(key, factory);
  }

  resolve<T>(key: string): T {
    const factory = this.services.get(key);
    if (!factory) {
      throw new Error(`Service ${key} not found`);
    }
    return factory();
  }
}

// bootstrap.ts - Application setup
const container = new Container();

// Register repositories
container.register('PrismaClient', () => new PrismaClient());

container.register('BookingRepository', () =>
  new BookingRepository(container.resolve('PrismaClient'))
);

container.register('RoomRepository', () =>
  new RoomRepository(container.resolve('PrismaClient'))
);

container.register('UserRepository', () =>
  new UserRepository(container.resolve('PrismaClient'))
);

// Register services
container.register('ValidationService', () =>
  new ValidationService()
);

container.register('WebSocketManager', () =>
  new WebSocketManager()
);

container.register('NotificationService', () => {
  const service = new NotificationService();
  const wsManager = container.resolve('WebSocketManager');
  service.attach(new BookingObserver(wsManager));
  service.attach(new RoomStatusObserver(wsManager));
  return service;
});

container.register('BookingService', () =>
  new BookingService(
    container.resolve('BookingRepository'),
    container.resolve('RoomRepository'),
    container.resolve('ValidationService'),
    container.resolve('NotificationService')
  )
);

container.register('RoomService', () =>
  new RoomService(
    container.resolve('RoomRepository'),
    container.resolve('BookingRepository')
  )
);

// Register controllers
container.register('BookingController', () =>
  new BookingController(container.resolve('BookingService'))
);

container.register('RoomController', () =>
  new RoomController(container.resolve('RoomService'))
);

export { container };
```

### Frontend OOP Service Examples

```typescript
// src/services/BookingService.ts
class BookingService extends BaseService {
  constructor(
    private readonly apiClient: ApiClient,
    private readonly bookingRepository: BookingRepository
  ) {
    super();
  }

  async createBooking(
    roomId: string,
    startTime: Date,
    endTime: Date
  ): Promise<Booking> {
    // Optimistic update
    const tempBooking = BookingFactory.create(
      'current-user-id', // from auth context
      roomId,
      startTime,
      endTime
    );

    this.bookingRepository.addOptimistic(tempBooking);

    try {
      const response = await this.apiClient.post('/bookings', {
        roomId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      });

      const booking = BookingFactory.fromDTO(response.data);
      this.bookingRepository.update(booking);
      return booking;
    } catch (error) {
      this.bookingRepository.rollback(tempBooking.id);
      throw error;
    }
  }

  async getAvailableSlots(roomId: string, date: Date): Promise<TimeSlot[]> {
    const response = await this.apiClient.get(
      `/rooms/${roomId}/availability`,
      { params: { date: date.toISOString().split('T')[0] } }
    );

    return TimeSlotFactory.fromDTOArray(response.data);
  }
}

// src/repositories/BookingRepository.ts (Frontend)
class BookingRepository implements IRepository<Booking> {
  private cache = new Map<string, Booking>();

  async findById(id: string): Promise<Booking | null> {
    return this.cache.get(id) || null;
  }

  async findAll(): Promise<Booking[]> {
    return Array.from(this.cache.values());
  }

  update(booking: Booking): void {
    this.cache.set(booking.id, booking);
  }

  addOptimistic(booking: Booking): void {
    this.cache.set(booking.id, booking);
  }

  rollback(id: string): void {
    this.cache.delete(id);
  }

  delete(id: string): void {
    this.cache.delete(id);
  }
}

// src/lib/ApiClient.ts
class ApiClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json'
    };
  }

  setAuthToken(token: string): void {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  async get<T>(endpoint: string, options?: any): Promise<{ data: T }> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.headers,
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return { data: await response.json() };
  }

  async post<T>(endpoint: string, body: any): Promise<{ data: T }> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return { data: await response.json() };
  }

  async delete<T>(endpoint: string): Promise<{ data: T }> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return { data: await response.json() };
  }
}

// src/lib/WebSocketManager.ts
class WebSocketManager {
  private socket: Socket | null = null;
  private listeners = new Map<string, Set<Function>>();

  connect(url: string, token: string): void {
    this.socket = io(url, {
      auth: { token }
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());

      // Register actual socket listener
      this.socket?.on(event, (data: any) => {
        const callbacks = this.listeners.get(event);
        callbacks?.forEach(cb => cb(data));
      });
    }

    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);

      if (callbacks.size === 0) {
        this.listeners.delete(event);
        this.socket?.off(event);
      }
    }
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.listeners.clear();
  }
}

// Usage in React component with custom hook
function useBookingService() {
  const apiClient = useMemo(() => new ApiClient(import.meta.env.VITE_API_URL), []);
  const repository = useMemo(() => new BookingRepository(), []);
  const service = useMemo(() => new BookingService(apiClient, repository), [apiClient, repository]);

  return service;
}
```

### Real-time Updates
- WebSocket event `room:status:changed` → Broadcast to all connected clients
- Emit on booking create/cancel/complete
- Include roomId, status, timestamp

## Performance Requirements

### Frontend Targets
- Initial load: < 1.5s (LCP)
- Time to Interactive: < 2s
- Room status updates: < 100ms latency
- Bundle size: < 300KB (gzipped)

### Backend Targets
- API response time: < 100ms (p95)
- WebSocket message delivery: < 50ms
- Database query optimization: Indexed on roomId, startTime, userId
- Horizontal scaling ready (stateless design)

### Optimization Techniques
- Enable Vite code splitting by route
- Use Prisma query optimization (`select`, `include` strategically)
- Implement Redis caching for room availability (5-second TTL)
- CDN for static assets
- Database connection pooling

## UI/UX Design Principles

### Visual Design
- Clean, minimal interface (inspired by Calendly/Google Calendar)
- Card-based layout for rooms
- Calendar/timeline view for bookings
- Responsive design (mobile-first)
- Dark/light mode support

### Color System
- Available: Green (#10B981)
- Occupied: Red (#EF4444)
- Maintenance: Yellow (#F59E0B)
- Primary actions: Blue (#3B82F6)

### User Experience
- **Zero-click status**: See all room availability on landing page
- **One-click booking**: Minimal form fields (pre-fill user, select 1 or 2 hour slots)
- **Instant feedback**: Optimistic updates + skeleton loaders
- **Error recovery**: Clear error messages, auto-retry on network failure
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### Component Library
Use shadcn/ui for consistent, accessible components:
- Button, Card, Dialog, Calendar
- Toast for notifications
- Badge for room status
- Skeleton for loading states

## Development Commands

### Frontend (./client)
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (Vite) on http://localhost:5173
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run Vitest tests
npm run lint         # ESLint check
npm run type-check   # TypeScript check
```

### Backend (./server)
```bash
npm install          # Install dependencies
npm run dev          # Start dev server with hot reload on http://localhost:3000
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run test         # Run Jest tests
npx prisma migrate dev  # Run database migrations
npx prisma studio    # Open Prisma Studio GUI
npx prisma generate  # Generate Prisma Client
```

### Full Stack
```bash
# Run both frontend and backend concurrently
npm run dev          # From root (if using concurrently setup)
```

## Database Setup

1. Create PostgreSQL database:
   ```bash
   createdb study_rooms
   ```

2. Configure `.env` in server directory:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/study_rooms"
   JWT_SECRET="your-secret-key"
   PORT=3000
   ```

3. Run migrations:
   ```bash
   cd server && npx prisma migrate dev
   ```

## Testing Strategy (OOP-Focused)

### Unit Testing Classes

**Testing Entities:**
```typescript
// Booking.test.ts
describe('Booking Entity', () => {
  it('should create valid booking', () => {
    const booking = new Booking(
      '123',
      'room-1',
      'user-1',
      new Date('2025-01-20T10:00:00'),
      new Date('2025-01-20T11:00:00'),
      BookingStatus.ACTIVE
    );

    expect(booking.getDurationHours()).toBe(1);
    expect(booking.isActive()).toBe(true);
  });

  it('should validate booking duration', () => {
    expect(() => {
      new Booking(
        '123',
        'room-1',
        'user-1',
        new Date('2025-01-20T10:00:00'),
        new Date('2025-01-20T13:00:00'), // 3 hours - invalid
        BookingStatus.ACTIVE
      );
    }).toThrow('Booking must be 1 or 2 hours');
  });

  it('should detect conflicts', () => {
    const booking1 = new Booking(
      '1',
      'room-1',
      'user-1',
      new Date('2025-01-20T10:00:00'),
      new Date('2025-01-20T11:00:00'),
      BookingStatus.ACTIVE
    );

    const booking2 = new Booking(
      '2',
      'room-1',
      'user-2',
      new Date('2025-01-20T10:30:00'),
      new Date('2025-01-20T11:30:00'),
      BookingStatus.ACTIVE
    );

    expect(booking1.conflictsWith(booking2)).toBe(true);
  });
});
```

**Testing Services with Mocks:**
```typescript
// BookingService.test.ts
describe('BookingService', () => {
  let bookingService: BookingService;
  let mockBookingRepo: jest.Mocked<BookingRepository>;
  let mockRoomRepo: jest.Mocked<RoomRepository>;
  let mockValidationService: jest.Mocked<ValidationService>;
  let mockNotificationService: jest.Mocked<NotificationService>;

  beforeEach(() => {
    // Create mocks
    mockBookingRepo = {
      findById: jest.fn(),
      findAll: jest.fn(),
      findByRoomAndDateRange: jest.fn(),
      save: jest.fn(),
      delete: jest.fn()
    } as any;

    mockRoomRepo = {
      findById: jest.fn(),
      save: jest.fn()
    } as any;

    mockValidationService = {
      validateBookingRules: jest.fn()
    } as any;

    mockNotificationService = {
      notifyBookingCreated: jest.fn(),
      notifyBookingCancelled: jest.fn()
    } as any;

    // Inject mocks via constructor
    bookingService = new BookingService(
      mockBookingRepo,
      mockRoomRepo,
      mockValidationService,
      mockNotificationService
    );
  });

  it('should create booking when no conflicts', async () => {
    const startTime = new Date('2025-01-20T10:00:00');
    const endTime = new Date('2025-01-20T11:00:00');

    mockValidationService.validateBookingRules.mockResolvedValue();
    mockBookingRepo.findByRoomAndDateRange.mockResolvedValue([]);
    mockBookingRepo.save.mockImplementation(async (b) => b);
    mockRoomRepo.findById.mockResolvedValue(
      new Room('room-1', 'Room A', 10, [], RoomStatus.AVAILABLE)
    );

    const booking = await bookingService.createBooking(
      'user-1',
      'room-1',
      startTime,
      endTime
    );

    expect(booking).toBeInstanceOf(Booking);
    expect(mockBookingRepo.save).toHaveBeenCalled();
    expect(mockNotificationService.notifyBookingCreated).toHaveBeenCalledWith(booking);
  });

  it('should throw error when time slot has conflict', async () => {
    const startTime = new Date('2025-01-20T10:00:00');
    const endTime = new Date('2025-01-20T11:00:00');

    const existingBooking = new Booking(
      '999',
      'room-1',
      'other-user',
      startTime,
      endTime,
      BookingStatus.ACTIVE
    );

    mockValidationService.validateBookingRules.mockResolvedValue();
    mockBookingRepo.findByRoomAndDateRange.mockResolvedValue([existingBooking]);

    await expect(
      bookingService.createBooking('user-1', 'room-1', startTime, endTime)
    ).rejects.toThrow('Time slot already booked');
  });
});
```

**Testing Repositories:**
```typescript
// BookingRepository.test.ts
describe('BookingRepository', () => {
  let repository: BookingRepository;
  let prisma: PrismaClient;

  beforeAll(async () => {
    // Use test database
    prisma = new PrismaClient({
      datasources: { db: { url: process.env.TEST_DATABASE_URL } }
    });
    repository = new BookingRepository(prisma);
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.booking.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should save and retrieve booking', async () => {
    const booking = new Booking(
      crypto.randomUUID(),
      'room-1',
      'user-1',
      new Date('2025-01-20T10:00:00'),
      new Date('2025-01-20T11:00:00'),
      BookingStatus.ACTIVE
    );

    await repository.save(booking);

    const retrieved = await repository.findById(booking.id);

    expect(retrieved).not.toBeNull();
    expect(retrieved?.roomId).toBe('room-1');
    expect(retrieved).toBeInstanceOf(Booking);
  });
});
```

**Testing Controllers:**
```typescript
// BookingController.test.ts
describe('BookingController', () => {
  let controller: BookingController;
  let mockService: jest.Mocked<BookingService>;

  beforeEach(() => {
    mockService = {
      createBooking: jest.fn(),
      cancelBooking: jest.fn(),
      extendBooking: jest.fn()
    } as any;

    controller = new BookingController(mockService);
  });

  it('should create booking and return 201', async () => {
    const mockBooking = new Booking(
      '123',
      'room-1',
      'user-1',
      new Date('2025-01-20T10:00:00'),
      new Date('2025-01-20T11:00:00'),
      BookingStatus.ACTIVE
    );

    mockService.createBooking.mockResolvedValue(mockBooking);

    const request = {
      body: {
        roomId: 'room-1',
        startTime: '2025-01-20T10:00:00',
        endTime: '2025-01-20T11:00:00'
      },
      user: { id: 'user-1' }
    } as any;

    const reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn()
    } as any;

    await controller.createBooking(request, reply);

    expect(reply.code).toHaveBeenCalledWith(201);
    expect(reply.send).toHaveBeenCalledWith({
      success: true,
      data: mockBooking
    });
  });
});
```

### Frontend Tests
- **Unit**: Entity and service class methods
- **Integration**: User flows with service layer (booking a room end-to-end)
- **Component**: React components with mocked services
- **Visual**: Storybook for component showcase

### Backend Tests
- **Unit**: Service layer logic with mocked repositories
- **Integration**: API endpoint tests with real database (test environment)
- **Repository**: Database operations with test database
- **E2E**: Critical flows (create booking, WebSocket updates)

### Test Data
Seed 4 rooms with realistic data:
```bash
npx prisma db seed
```

### Testing Best Practices
- Mock external dependencies (repositories, external APIs)
- Test public interfaces, not private methods
- Use dependency injection for easy mocking
- Test edge cases and validation logic
- Keep tests isolated and independent
- Use factories for test data creation

## Code Quality Standards

### TypeScript Configuration
- Strict mode enabled
- No implicit any
- Shared types between frontend/backend in `@/types` package
- Enable `strictPropertyInitialization` for class properties
- Use `readonly` for immutable properties

### OOP Design Guidelines

**Class Design:**
- Keep classes focused and cohesive (Single Responsibility)
- Favor composition over inheritance
- Use abstract classes for base functionality
- Implement interfaces for contracts
- Make class members private by default, expose only what's necessary

**SOLID Principles:**
- **Single Responsibility**: Each class has one reason to change
  - ✅ `BookingService` handles booking business logic only
  - ❌ Don't combine booking logic with notification logic in one class

- **Open/Closed**: Extend behavior without modifying existing code
  - ✅ Use Strategy pattern for different validation rules
  - ❌ Don't add if/else chains for new booking types

- **Liskov Substitution**: Subtypes must be substitutable for base types
  - ✅ All `Repository` implementations can replace `BaseRepository`
  - ❌ Don't override methods to throw "Not Implemented"

- **Interface Segregation**: Small, specific interfaces
  - ✅ `IObserver`, `IRepository`, `IValidationStrategy`
  - ❌ Don't create one giant `IService` interface

- **Dependency Inversion**: Depend on abstractions
  - ✅ `BookingService` depends on `IRepository` interface
  - ❌ Don't directly instantiate repositories in services

**Domain-Driven Design:**
- Entity: Has identity, mutable (Room, Booking, User)
- Value Object: No identity, immutable (TimeSlot)
- Service: Orchestrates business logic (BookingService)
- Repository: Data access abstraction (BookingRepository)
- Factory: Creates complex objects (BookingFactory)

### Folder Organization
- Domain layer shared between frontend/backend
- Separate concerns: domain, services, repositories, controllers
- Collocate related files (component + styles + tests)
- Absolute imports (`@/domain` not `../../domain`)

### Naming Conventions
- Classes: PascalCase (BookingService, RoomRepository)
- Interfaces: PascalCase with 'I' prefix (IRepository, IObserver)
- Abstract classes: PascalCase with 'Base' prefix optional (BaseController)
- Components: PascalCase (RoomCard.tsx)
- Hooks: camelCase with 'use' prefix (useBookingService.ts)
- Methods: camelCase (createBooking, isAvailable)
- Private members: camelCase with '_' prefix optional (private _status)
- Constants/Enums: UPPER_SNAKE_CASE or PascalCase
- Types/DTOs: PascalCase (BookingDTO, RoomData)

### Design Pattern Usage

**Repository Pattern**:
- All database access through repositories
- Return domain entities, not raw Prisma objects
- Use factories to convert between Prisma and domain models

**Service Layer Pattern**:
- Business logic in services, not controllers or repositories
- Services orchestrate multiple repositories
- Services handle transactions and validation

**Factory Pattern**:
- Use factories to create entities from DTOs
- Encapsulate complex object creation
- Convert between domain models and data models

**Observer Pattern**:
- Real-time updates via observers
- NotificationService as Subject
- WebSocket handlers as Observers

**Strategy Pattern**:
- Different validation rules as strategies
- Pluggable algorithms (pricing, booking rules)

**Dependency Injection**:
- Constructor injection for dependencies
- Use DI container for wiring
- Test with mock implementations

## Deployment

### Frontend
- Build: `npm run build` (outputs to `dist/`)
- Deploy to: Vercel/Netlify/Cloudflare Pages
- Environment variables: `VITE_API_URL`, `VITE_WS_URL`

### Backend
- Build: `npm run build` (outputs to `dist/`)
- Deploy to: Railway/Render/Fly.io
- Environment variables: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN`

### Database
- Production: Managed PostgreSQL (Supabase, Neon, Railway)
- Migrations: Run `prisma migrate deploy` in CI/CD

## Key Implementation Notes

1. **WebSocket Connection Management**
   - Implement reconnection logic with exponential backoff
   - Heartbeat ping/pong every 30 seconds
   - Clean up listeners on component unmount

2. **Optimistic UI Pattern**
   ```typescript
   // Example for booking creation
   const { mutate } = useMutation({
     mutationFn: createBooking,
     onMutate: async (newBooking) => {
       await queryClient.cancelQueries(['bookings']);
       const previous = queryClient.getQueryData(['bookings']);
       queryClient.setQueryData(['bookings'], (old) => [...old, newBooking]);
       return { previous };
     },
     onError: (err, variables, context) => {
       queryClient.setQueryData(['bookings'], context.previous);
       toast.error('Booking failed. Please try again.');
     },
     onSuccess: () => {
       toast.success('Room booked successfully!');
     }
   });
   ```

3. **Time Handling**
   - Use `date-fns` for date manipulation (lighter than moment.js)
   - Store all times in UTC, display in user's timezone
   - 1-hour time slot intervals (7:00 AM, 8:00 AM, 9:00 AM, ..., 8:00 PM)
   - Validate booking is at least 1 day in advance (not same-day or next-day bookings)

4. **Validation with Zod**
   - Define schemas in `@/types/schemas.ts`
   - Share between frontend forms and backend validation
   - Example:
   ```typescript
   const bookingSchema = z.object({
     roomId: z.string().uuid(),
     startTime: z.date(),
     endTime: z.date(),
   }).refine((data) => {
     const duration = (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60 * 60);
     return duration === 1 || duration === 2;
   }, {
     message: "Booking must be exactly 1 or 2 hours"
   }).refine((data) => {
     const hour = data.startTime.getHours();
     return hour >= 7 && hour < 21;
   }, {
     message: "Bookings only available between 7 AM and 9 PM"
   }).refine((data) => {
     const tomorrow = new Date();
     tomorrow.setDate(tomorrow.getDate() + 1);
     tomorrow.setHours(0, 0, 0, 0);
     return data.startTime >= tomorrow;
   }, {
     message: "Must book at least 1 day in advance"
   });
   ```

## Critical Performance Considerations

1. **Database Indexes**
   ```prisma
   @@index([roomId, startTime])
   @@index([userId, status])
   ```

2. **Query Optimization**
   - Use `select` to fetch only needed fields
   - Implement cursor-based pagination for booking history
   - Add database-level constraints for data integrity

3. **Caching Strategy**
   - TanStack Query: 5-minute stale time for room list
   - Redis: Cache availability calculations (invalidate on booking change)
   - CDN: Static assets with long cache headers

4. **Bundle Optimization**
   - Tree-shaking unused code
   - Dynamic imports for routes
   - Separate vendor chunks
   - Compress images (use WebP format)

## Security Considerations

- JWT-based authentication with HTTP-only cookies
- Rate limiting on booking endpoints (max 10 requests/minute)
- Input sanitization with Zod validation
- CORS configuration for production domains only
- Prepared statements via Prisma (SQL injection protection)
- WebSocket authentication via JWT token

## OOP Architecture Summary

### Layer Responsibilities

**Domain Layer** (Entities, Value Objects, Enums)
- Core business logic and rules
- Self-validating entities
- Immutable value objects
- No external dependencies
- Shared between frontend and backend

**Repository Layer** (Data Access)
- Abstract database operations
- Convert between domain entities and persistence models
- Implement IRepository interface
- Use Factory pattern for conversions

**Service Layer** (Business Logic)
- Orchestrate multiple repositories
- Implement complex business workflows
- Handle transactions
- Coordinate with observers for side effects

**Controller Layer** (HTTP Handlers - Backend only)
- Parse HTTP requests
- Delegate to services
- Format HTTP responses
- Handle errors gracefully

**Factory Layer** (Object Creation)
- Create complex domain objects
- Convert DTOs to entities
- Handle entity construction logic

**Strategy Layer** (Pluggable Algorithms)
- Different validation rules
- Pricing strategies (future)
- Extendable business rules

**Observer Layer** (Event Handling)
- Real-time notifications
- WebSocket broadcasts
- Decoupled event handling

### OOP Benefits in This Project

1. **Maintainability**: Clear separation of concerns makes code easier to understand and modify
2. **Testability**: Dependency injection allows easy mocking and isolated testing
3. **Reusability**: Domain entities shared between frontend and backend
4. **Extensibility**: New features via Strategy, Observer patterns without modifying existing code
5. **Type Safety**: TypeScript classes provide strong typing and IntelliSense
6. **Business Logic Encapsulation**: Rules live in entities (e.g., `booking.canExtend()`)

### Quick Reference: When to Use Each Pattern

- **Repository**: Need to access database → Use Repository
- **Service**: Complex business logic spanning multiple entities → Use Service
- **Factory**: Creating entities from API responses or forms → Use Factory
- **Observer**: Broadcasting changes to multiple listeners → Use Observer
- **Strategy**: Multiple algorithms for the same task → Use Strategy
- **Dependency Injection**: Need to swap implementations or mock → Use DI

## Future Enhancements

- Email notifications for booking confirmations (NotificationService extension)
- Recurring bookings (new RecurringBooking entity)
- Room equipment checkout (new Equipment entity with Repository)
- Analytics dashboard (new AnalyticsService with reporting strategies)
- Mobile app (React Native sharing domain layer)
- QR code check-in system (new CheckInService)
- Payment integration (PricingStrategy + PaymentService)
- Room rating system (new Rating value object)

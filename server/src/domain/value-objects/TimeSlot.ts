export class TimeSlot {
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
    const endAMPM = this.endHour < 12 || this.endHour === 24 ? 'AM' : 'PM';
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

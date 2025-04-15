export enum AppointmentStatus {
	OPEN = 0,
	SCHEDULED = 1,
	DONE = 2,
	CANCELLED_BY_USER = 3,
	CANCELLED_BY_SERVICE = 4,
}

export interface Appointment {
	id: number;
	userId?: string | null;
	serviceId: number;
	appointmentDate: string; // ISO string
	status: AppointmentStatus;
	// Optionally, for expanded API responses:
	booker?: any; // User object, if included
	service?: any; // Service object, if included
}

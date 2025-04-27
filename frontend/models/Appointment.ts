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
	appointmentDate: string;
	status: AppointmentStatus;
	booker?: any;
	service?: any;
}

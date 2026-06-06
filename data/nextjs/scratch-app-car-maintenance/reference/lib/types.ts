export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
}

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  serviceType: string;
  date: string;
  mileageAtService: number;
  cost: number;
  notes: string;
}

export interface Reminder {
  id: string;
  vehicleId: string;
  title: string;
  dueDate: string;
  dueMileage: number;
  completed: boolean;
}

export type Route = 'home' | 'vehicles' | 'service' | 'reminders';

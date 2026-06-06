export interface Student {
  id: number;
  name: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  id: number;
  studentId: number;
  date: string;
  status: AttendanceStatus;
}

export type Route = 'home' | 'attendance' | 'students' | 'summary';

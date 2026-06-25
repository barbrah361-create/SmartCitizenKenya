export interface User {
  id: string;
  name: string;
  nationalId: string;
  phone: string;
  email: string;
  role: 'citizen' | 'admin';
  status: 'active' | 'disabled';
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  department: string;
  estimatedDays: number;
  requirements: string[];
}

export interface Application {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  serviceId: string;
  serviceName: string;
  status: 'Draft' | 'Submitted' | 'Pending Review' | 'Approved' | 'Rejected' | 'Completed';
  fields: Record<string, string>;
  documents: Array<{ id: string; name: string; url: string; size: string }>;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  applicationId: string;
  serviceName: string;
  citizenName: string;
  citizenNationalId: string;
  citizenPhone: string;
  citizenEmail: string;
  issueDate: string;
  refNumber: string;
  qrCodeValue: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

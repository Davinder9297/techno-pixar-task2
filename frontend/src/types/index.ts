export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  isActive: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

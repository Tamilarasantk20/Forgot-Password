export enum ErrorType {
  INLINE = 'INLINE',
  GLOBAL = 'GLOBAL'
}

export interface FormErrors {
  email?: string;
  password?: string;
  global?: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  errorType?: ErrorType;
}
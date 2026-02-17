import { AuthResponse, ErrorType } from '../types';

export const mockLogin = async (email: string, password: string): Promise<AuthResponse> => {
  // Simulate network delay for 'Processing' state
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulation: Server Error
  if (email === 'server@error.com') {
    return {
      success: false,
      error: "Verification could not be completed",
      errorType: ErrorType.GLOBAL
    };
  }

  // Simulation: Wrong credentials
  if (email !== 'user@example.com' || password !== 'Pass123') {
    return {
      success: false,
      error: "The email or password you entered is incorrect.",
      errorType: ErrorType.GLOBAL
    };
  }

  return { success: true };
};
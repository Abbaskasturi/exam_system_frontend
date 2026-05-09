export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  subdomain: string;
}

export async function registerInstitute(data: RegisterData) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const response = await fetch(`${baseUrl}/institutes/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Registration failed. Please try again.');
  }

  return response.json();
}

export interface LoginData {
  email: string;
  password?: string;
}

export async function loginInstitute(data: LoginData) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const response = await fetch(`${baseUrl}/institutes/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Login failed. Please check your credentials.');
  }

  return response.json();
}

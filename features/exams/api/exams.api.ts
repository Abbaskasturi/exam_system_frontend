export interface ExamData {
  name: string;
  course: string;
  year: number;
  duration_minute: number;
  total_marks: number;
  start_time: string; // ISO format date string
  end_time: string;   // ISO format date string
  is_active: boolean;
}

export async function createExam(examData: ExamData) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
  
  // Retrieve token from local storage
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}/exams`, {
    method: 'POST',
    headers,
    body: JSON.stringify(examData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create exam. Please try again.');
  }

  return response.json();
}

export async function getExams() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}/exams`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch exams.');
  }

  return response.json();
}

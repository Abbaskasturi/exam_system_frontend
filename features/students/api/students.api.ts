export interface StudentRegistrationData {
  name: string;
  course: string;
  year: string;
  email: string;
  institute_id: number;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export async function getExamDetails(link: string) {
  const response = await fetch(`${baseUrl}/exams/${link}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // We disable caching here so the student gets fresh exam details
    cache: 'no-store', 
  });

  if (!response.ok) {
    throw new Error('Exam not found or link is invalid.');
  }

  return response.json();
}

export async function registerStudent(data: StudentRegistrationData) {
  const response = await fetch(`${baseUrl}/students/register`, {
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

export async function getQuestionPaper(id: string) {
  const response = await fetch(`${baseUrl}/questions/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Question paper not found.');
  }

  return response.json();
}

export async function submitOption(data: FormData) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}/submissions/submit`, {
    method: 'POST',
    headers,
    body: data,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Submission failed. Please try again.');
  }

  return response.json();
}

export interface StudentRegistrationData {
  name: string;
  course: string;
  year: string;
  email: string;
  institute_id: number;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

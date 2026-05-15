export async function uploadQuestionPaper(file: File, difficultyLevel: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

  // Retrieve token from local storage
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('difficulty_level', difficultyLevel);

  const headers: HeadersInit = {};

  // Attach Authorization header if we have a token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Note: We deliberately do NOT set 'Content-Type' to 'multipart/form-data'. 
  // Fetch API automatically sets it correctly with the proper boundary when body is FormData.

  const response = await fetch(`${baseUrl}/questions`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Upload failed. Please try again.');
  }

  return response.json();
}

export async function getQuestions() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}/questions`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch questions.');
  }

  return response.json();
}

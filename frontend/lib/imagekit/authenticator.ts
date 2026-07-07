export interface AuthResponse {
  signature: string;
  token: string;
  expire: number;
  publicKey: string;
}

export async function authenticate(): Promise<AuthResponse> {
  const response = await fetch("/api/upload-auth");

  if (!response.ok) {
    throw new Error("Failed to authenticate");
  }

  return response.json();
}
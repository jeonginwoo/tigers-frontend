export interface AuthStatusResponse {
  logged_in: boolean;
  user_id?: number;
}

export interface AccountProfile {
  id: number;
  email: string;
  nickname: string;
  created_at?: string;
}

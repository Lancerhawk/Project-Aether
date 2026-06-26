export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface HealthCheckData {
  status: string;
  version: string;
  timestamp: string;
  uptime: number;
}

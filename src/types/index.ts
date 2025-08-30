export interface ImageMetadata {
  description?: string;
  tags: string[];
  colors: string[];
  ai_processing_status: string;
}

export interface ImageItem {
  id: number;
  filename: string;
  original_path: string;
  thumbnail_path: string;
  uploaded_at: string;
  metadata?: ImageMetadata;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

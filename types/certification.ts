export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  image?: string;
  order?: number;
}

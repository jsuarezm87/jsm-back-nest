export interface JwtPayload {
  uid: string;
  name: string;
  email: string;
  iat?: number;
  exp?: number;
}

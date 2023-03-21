export interface JwtPayload {
  userId: number;
  email: string;
  nickname: string;
}

export interface JwtObject extends JwtPayload {
  iat: number;
  exp: number;
  iss: string;
}

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

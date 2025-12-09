import { jwtVerify } from 'jose';

export async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    
    // verify the token signature
    const { payload } = await jwtVerify(token, secret);
    
    return {
      id: payload.user_id,
    };
  } catch (error) {
    // Token is expired or invalid
    return null;
  }
}
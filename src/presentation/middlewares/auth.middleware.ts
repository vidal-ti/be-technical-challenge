import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../infrastructure/services/AuthService';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'No token provided',
      });
      return;
    }

    const decoded = AuthService.verifyToken(token);
    (req as any).userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }
};

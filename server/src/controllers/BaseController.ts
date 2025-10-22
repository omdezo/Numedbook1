import { Response } from 'express';

export abstract class BaseController {
  protected sendSuccess<T>(res: Response, data: T, statusCode = 200): Response {
    return res.status(statusCode).json({ success: true, data });
  }

  protected sendError(res: Response, message: string, statusCode = 400): Response {
    return res.status(statusCode).json({ success: false, error: message });
  }
}

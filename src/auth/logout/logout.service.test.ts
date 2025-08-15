import { describe, it, expect, vi, beforeEach } from 'vitest';

import { CookieHelper } from '../../common/utils/cookieHelper';
import { NextFunction, Request, Response } from 'express';
import { logout } from './logout.service';

describe('logout', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    mockNext = vi.fn();

    vi.spyOn(CookieHelper, 'clearAuthCookie').mockImplementation(() => {});
    vi.spyOn(CookieHelper, 'clearRefreshCookie').mockImplementation(() => {});
  });

  it('should clear auth and refresh cookies and return success message', async () => {
    await logout(mockReq as Request, mockRes as Response, mockNext);

    expect(CookieHelper.clearAuthCookie).toHaveBeenCalledWith(mockRes);
    expect(CookieHelper.clearRefreshCookie).toHaveBeenCalledWith(mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next with error if an exception occurs', async () => {
    const error = new Error('test error');
    (CookieHelper.clearAuthCookie as any).mockImplementation(() => {
      throw error;
    });

    await logout(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from '../services/api';
import * as goalService from '../services/goalService';
import * as userService from '../services/userService';
import * as coachingService from '../services/coachingService';

describe('goalService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getGoals calls GET /goals/', async () => {
    api.get.mockResolvedValue({ data: [{ id: 1 }] });
    const result = await goalService.getGoals();
    expect(api.get).toHaveBeenCalledWith('/goals/', { params: {} });
    expect(result).toEqual([{ id: 1 }]);
  });

  it('createGoal calls POST /goals/', async () => {
    api.post.mockResolvedValue({ data: { id: 2, title: 'New goal' } });
    const result = await goalService.createGoal({ title: 'New goal' });
    expect(api.post).toHaveBeenCalledWith('/goals/', { title: 'New goal' });
    expect(result.title).toBe('New goal');
  });

  it('deleteGoal calls DELETE /goals/:id/', async () => {
    api.delete.mockResolvedValue({ data: {} });
    await goalService.deleteGoal(5);
    expect(api.delete).toHaveBeenCalledWith('/goals/5/');
  });
});

describe('userService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getProfile calls GET /users/profile/', async () => {
    api.get.mockResolvedValue({ data: { id: 1, name: 'Ali' } });
    const result = await userService.getProfile();
    expect(api.get).toHaveBeenCalledWith('/users/profile/');
    expect(result.name).toBe('Ali');
  });

  it('changePassword posts current and new password', async () => {
    api.post.mockResolvedValue({ data: { success: true } });
    await userService.changePassword({ currentPassword: 'old123', newPassword: 'new123' });
    expect(api.post).toHaveBeenCalledWith('/users/change-password/', {
      current_password: 'old123',
      new_password: 'new123',
    });
  });
});

describe('coachingService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getSessions calls GET /sessions/', async () => {
    api.get.mockResolvedValue({ data: [] });
    await coachingService.getSessions();
    expect(api.get).toHaveBeenCalledWith('/sessions/', { params: {} });
  });

  it('sendMessage posts a text message to the session', async () => {
    api.post.mockResolvedValue({ data: { id: 1, text: 'hi' } });
    await coachingService.sendMessage(3, 'hi');
    expect(api.post).toHaveBeenCalledWith('/sessions/3/messages/', { text: 'hi' });
  });
});

import { describe, it, expect } from 'vitest';
import { INITIAL_MOCK_REQUESTS, INITIAL_MOCK_VOLUNTEER } from '../data/mockData';
import type { RequestStatus } from '../types';

describe('Workflow & Data Contract Validation', () => {
  it('contains valid mock data across all standard lifecycle states', () => {
    const statuses: RequestStatus[] = INITIAL_MOCK_REQUESTS.map((r) => r.status);

    expect(statuses).toContain('open');
    expect(statuses).toContain('matched');
    expect(statuses).toContain('in_progress');
    expect(statuses).toContain('completed');
  });

  it('guarantees volunteer profile has valid radius bounds and verified skills', () => {
    expect([1, 3, 5, 10, 15]).toContain(INITIAL_MOCK_VOLUNTEER.radiusKm);
    expect(INITIAL_MOCK_VOLUNTEER.skills.length).toBeGreaterThan(0);
    expect(INITIAL_MOCK_VOLUNTEER.rating).toBeGreaterThanOrEqual(1);
    expect(INITIAL_MOCK_VOLUNTEER.rating).toBeLessThanOrEqual(5);
  });

  it('ensures completed requests can hold feedback with valid ratings', () => {
    const completedReq = INITIAL_MOCK_REQUESTS.find((r) => r.status === 'completed');
    expect(completedReq).toBeDefined();
    if (completedReq?.feedback) {
      expect(completedReq.feedback.rating).toBeGreaterThanOrEqual(1);
      expect(completedReq.feedback.rating).toBeLessThanOrEqual(5);
      expect(completedReq.feedback.comment.length).toBeGreaterThan(5);
    }
  });
});

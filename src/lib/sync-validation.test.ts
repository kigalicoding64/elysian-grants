import { describe, expect, test } from 'bun:test';
import { activeOpportunities, publicSourceUrl } from './sync-validation';

describe('public scholarship scans', () => {
  test('only public website addresses are accepted', () => {
    expect(publicSourceUrl('studyinchina.cn')).toBe('https://studyinchina.cn/');
    for (const url of ['localhost', '127.0.0.1', '10.0.0.1', 'http://[::1]', 'https://user:password@example.org']) {
      expect(() => publicSourceUrl(url)).toThrow();
    }
  });
  test('expired announcements are excluded, including deadline-day opportunities', () => {
    const rows = activeOpportunities([
      { title: 'Expired', deadline: '2026-11-08' },
      { title: 'Today', deadline: '2026-11-09' },
      { title: 'Future', deadline: '2026-11-10' },
    ], 'https://hec.gov.rw/', '2026-11-09');
    expect(rows.map(row => row.title)).toEqual(['Today', 'Future']);
  });
  test('all six extracted detail fields survive normalization', () => {
    const details = { about_institution: 'Institution', coverage_summary: 'Coverage', eligibility: 'Eligibility', financial_criteria: 'Income', required_documents: 'Certificates', student_responsibilities: 'Steps' };
    const rows = activeOpportunities([{ title: 'Scholarship', ...details }], 'https://hec.gov.rw/', '2026-11-09');
    for (const [key, value] of Object.entries(details)) expect(rows[0]?.[key]).toBe(value);
  });
});
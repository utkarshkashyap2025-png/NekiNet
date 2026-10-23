import { describe, it, expect } from 'vitest';
import { geminiService } from '../services/geminiService';

describe('Gemini AI Service & Fallback Validation', () => {
  it('throws descriptive error on empty input', async () => {
    await expect(geminiService.parseHelpRequest('')).rejects.toThrow(
      'Please enter a description'
    );
  });

  it('correctly classifies urgent medicine requests with high urgency and pharmacy skills', async () => {
    const result = await geminiService.parseHelpRequest(
      'Need an inhaler picked up urgently from Apollo Pharmacy'
    );

    expect(result.category).toBe('pharmacy_runs');
    expect(result.urgency).toBe('high');
    expect(result.requiredSkills).toContain('Prescription Pickup');
  });

  it('correctly classifies heavy grocery lifting requests', async () => {
    const result = await geminiService.parseHelpRequest(
      'Need help carrying 2 heavy bags of groceries and a water bottle up the stairs'
    );

    expect(result.category).toBe('groceries_errands');
    expect(result.requiredSkills).toContain('Heavy Lifting (>10kg)');
  });

  it('correctly classifies tech assistance for smartphone setup', async () => {
    const result = await geminiService.parseHelpRequest(
      'Looking for a patient volunteer to help setup WhatsApp and explain smartphone to my grandmother'
    );

    expect(result.category).toBe('tech_support');
    expect(result.urgency).toBe('low');
  });

  it('strictly conforms to valid category and urgency schema enums', async () => {
    const result = await geminiService.parseHelpRequest('Friendly neighbor morning walk');
    const validCategories = [
      'elderly_care',
      'pharmacy_runs',
      'groceries_errands',
      'tech_support',
      'emergency_respite',
      'pet_care',
      'other',
    ];
    const validUrgencies = ['low', 'medium', 'high', 'critical'];

    expect(validCategories).toContain(result.category);
    expect(validUrgencies).toContain(result.urgency);
    expect(result.title.length).toBeGreaterThan(0);
  });
});

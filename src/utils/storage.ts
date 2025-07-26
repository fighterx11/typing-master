import { TestResults } from '@/components/TypingTest';

const STORAGE_KEY = 'typing-test-results';

export const saveTestResult = (result: TestResults): void => {
  try {
    const existingResults = getTestResults();
    const updatedResults = [...existingResults, result];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
  } catch (error) {
    console.error('Failed to save test result:', error);
  }
};

export const getTestResults = (): TestResults[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    // Ensure timestamps are Date objects
    return parsed.map((result: any) => ({
      ...result,
      timestamp: new Date(result.timestamp),
    }));
  } catch (error) {
    console.error('Failed to load test results:', error);
    return [];
  }
};

export const clearTestResults = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear test results:', error);
  }
};
import { parseUnixTimestamp } from './utils';

describe('parseUnixTimestamp', () => {
  test('should return a valid date in a human readable format', () => {
    const timestamp: number = 1588197712263;

    const result: string = parseUnixTimestamp(timestamp);

    // expect(result)?.toBe('2020-04-30 00:01');
    expect(result).toBe('2020-04-30 01:01');
  });

  test('should return another valid date in a human readable format', () => {
    const timestamp: number = 1479798793044;

    const result: string = parseUnixTimestamp(timestamp);

    // expect(result)?.toBe('2016-11-22 08:13');
    expect(result).toBe('2016-11-22 09:13');
  });
  test('should return a valid date in a human readable format', () => {
    const timestamp = 1588204860; // Exemplu timestamp
    const result: string = parseUnixTimestamp(timestamp); // Adaugă parametru pentru fus orar dacă funcția permite
    expect(result).toBe('1970-01-19 11:10');
  });
});

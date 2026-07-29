import { HighlightSearchPipe } from './highlight-search.pipe';

describe('HighlightSearchPipe', () => {
  let pipe: HighlightSearchPipe;

  beforeEach(() => {
    pipe = new HighlightSearchPipe();
  });

  it('creates an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('splits the text around a single match', () => {
    expect(pipe.transform('Riverside Plaza', 'plaza')).toEqual([
      { text: 'Riverside ', match: false },
      { text: 'Plaza', match: true },
    ]);
  });

  it('preserves the original casing of the matched text', () => {
    expect(pipe.transform('Riverside Plaza', 'RIVERSIDE')).toEqual([
      { text: 'Riverside', match: true },
      { text: ' Plaza', match: false },
    ]);
  });

  it('marks every occurrence', () => {
    expect(pipe.transform('Park East, Park West', 'park')).toEqual([
      { text: 'Park', match: true },
      { text: ' East, ', match: false },
      { text: 'Park', match: true },
      { text: ' West', match: false },
    ]);
  });

  it('returns a single unmatched segment when there is no search term', () => {
    const unmatched = [{ text: 'Riverside Plaza', match: false }];

    expect(pipe.transform('Riverside Plaza', '')).toEqual(unmatched);
    expect(pipe.transform('Riverside Plaza', '   ')).toEqual(unmatched);
    expect(pipe.transform('Riverside Plaza', null)).toEqual(unmatched);
    expect(pipe.transform('Riverside Plaza', undefined)).toEqual(unmatched);
  });

  it('returns no segments when there is no text', () => {
    expect(pipe.transform(null, 'plaza')).toEqual([]);
    expect(pipe.transform(undefined, 'plaza')).toEqual([]);
    expect(pipe.transform('', 'plaza')).toEqual([]);
  });

  it('returns a single unmatched segment when the term does not match', () => {
    expect(pipe.transform('Riverside Plaza', 'tower')).toEqual([
      { text: 'Riverside Plaza', match: false },
    ]);
  });

  it('treats regex metacharacters in the term literally', () => {
    expect(pipe.transform('Unit 4 (rear)', '(rear)')).toEqual([
      { text: 'Unit 4 ', match: false },
      { text: '(rear)', match: true },
    ]);
    expect(pipe.transform('Riverside Plaza', '.*')).toEqual([
      { text: 'Riverside Plaza', match: false },
    ]);
  });

  it('does not escape HTML, leaving it to Angular interpolation', () => {
    expect(pipe.transform('<b>Plaza</b>', 'plaza')).toEqual([
      { text: '<b>', match: false },
      { text: 'Plaza', match: true },
      { text: '</b>', match: false },
    ]);
  });

  it('handles a match at both the start and the end of the text', () => {
    expect(pipe.transform('aba', 'a')).toEqual([
      { text: 'a', match: true },
      { text: 'b', match: false },
      { text: 'a', match: true },
    ]);
  });
});

export const CONTEXT_TAGS = [
  'poor sleep',
  'great sleep',
  'socialised',
  'family time',
  'time alone',
  'busy day',
  'worked late',
  'relaxed day',
  'outdoors',
  'sick',
  'stressful event',
  'good news',
  'period',
  'poor diet',
] as const;

export type ContextTag = typeof CONTEXT_TAGS[number];

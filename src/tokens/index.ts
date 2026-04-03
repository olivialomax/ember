export const colors = {
  // Base
  cream: '#FAF7F2',
  warmWhite: '#FFFDF9',
  stone: '#8C8178',
  ink: '#2C2825',
  inkSoft: '#5C5550',

  // Sage
  sage: '#7A9E7E',
  sageLight: '#B5CEAB',
  sagePale: '#E8F0E4',

  // Amber
  amber: '#D4956A',
  amberPale: '#F5E6D8',

  // Trackers
  energyGold: '#C9A84C',
  stressRed: '#C97B7B',
  blueCalm: '#7B9EC9',
} as const;

export const typography = {
  display: 'PlayfairDisplay-Regular',
  displayMedium: 'PlayfairDisplay-Medium',
  displayItalic: 'PlayfairDisplay-Italic',
  body: 'DMSans-Regular',
  bodyMedium: 'DMSans-Medium',
  bodyLight: 'DMSans-Light',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 9999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#2C2825',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
  },
  subtle: {
    shadowColor: '#2C2825',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
} as const;

export const trackerColors = {
  mood: colors.sage,
  energy: colors.energyGold,
  stress: colors.stressRed,
  movement: colors.blueCalm,
  drinks: colors.amber,
} as const;

// Ride24/7 – core palette
// Primary reds / magentas
// #F63049, #D02752, #8A244B, #111F35
const primary = '#F63049';
const primaryDeep = '#D02752';
const accent = '#8A244B';
const navy = '#111F35';

const surfaceLight = 'rgba(17,31,53,0.02)';
const surfaceDark = 'rgba(246,48,73,0.08)';
const borderLight = 'rgba(17,31,53,0.12)';
const borderDark = 'rgba(246,48,73,0.3)';

export default {
  light: {
    text: navy,
    background: '#FFF6F8',
    tint: primary,
    tabIconDefault: '#C4AEB5',
    tabIconSelected: primary,
    card: surfaceLight,
    border: borderLight,
    chip: surfaceLight,
    chipBorder: borderLight,
  },
  dark: {
    text: '#FDF5F7',
    background: navy,
    tint: primaryDeep,
    tabIconDefault: '#9F8EA1',
    tabIconSelected: primaryDeep,
    card: surfaceDark,
    border: borderDark,
    chip: surfaceDark,
    chipBorder: borderDark,
  },
};

import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
  /** Put your mantine theme override here */
  breakpoints: {
    xxs: '23.5em', // 376 px
    xs: '36em', // 576 px
    sm: '48em', // 768 px
    md: '62em', // 992 px
    lg: '77.5em', // 1240 px
    xl: '93.5em', // 1496 px
    xxl: '120em', // 1920 px
  },
  fontFamily: 'Roboto',
  fontSizes: {
    xs: rem(12),
    sm: rem(13),
    md: rem(14),
    lg: rem(16),
    xl: rem(16),
    captionMd: rem(10),
    captionLg: rem(11),
    titleXs: rem(16),
    titleSm: rem(18),
    titleMd: rem(22),
    titleLg: rem(24),
    textDisplayMd: rem(28),
    textDisplayLg: rem(32),
    textDisplayXl: rem(40),
  },
  lineHeights: {
    xs: rem(16),
    sm: rem(16),
    md: rem(20),
    lg: rem(24),
    xl: rem(24),
    captionMd: rem(12),
    captionLg: rem(16),
    titleXs: rem(20),
    titleSm: rem(24),
    titleMd: rem(24),
    titleLg: rem(28),
    textDisplayMd: rem(32),
    textDisplayLg: rem(36),
    textDisplayXl: rem(44),
  },
  components: {},
});

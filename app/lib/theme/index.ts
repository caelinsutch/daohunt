import { extendTheme, theme as baseTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools';

import * as components from './components'
import * as foundations from './foundations'

export const theme: Record<string, any> = extendTheme({
  ...foundations,
  components: { ...components },
  colors: { ...baseTheme.colors, brand: baseTheme.colors.blue, secondaryTextColor: mode('gray.400', 'gray.600'), },
  space: {
    '4.5': '1.125rem',
  },
})

import base from './base.css'
import orgTheme from './theme'
import { deepMerge } from '../../../utils'


const fillBlocks = (block, theme) => (
  Object
    .entries(block)
    .reduce((filledBlock, [ rule, data ]) => {
      const match = data.match(/@\S*/i)
      // If no match, just set and return
      if(!match)
        return (filledBlock[rule] = data) && filledBlock

      // Remove the @ so we can find the theme value
      const fillVal = theme[match[0].replace('@', '')]
      // Replace the matched value with the theme values
      fillVal && (filledBlock[rule] = data.replace(match[0], fillVal))

      return filledBlock
    }, {})
)

const fillStyles = (theme, useStyles) => (
  Object
  .entries(useStyles)
  .reduce((styles, [ selector, block ]) => (
    (styles[selector] = fillBlocks(block, theme)) && styles
  ), {})
)


export const buildTheme = settings => {
  const useTheme = settings.theme
    ? deepMerge(orgTheme, settings.theme)
    : orgTheme
  
  const useStyles = settings.styles
    ? deepMerge(base, settings.styles)
    : base
  
  return fillStyles(useTheme, useStyles)
}
let DEF_CONFIG = {
  base: 5,
  spread: 2,
  range: 10,
  units: 'px',
  raw: false,
  negative: false,
}
let DEF_THEME
let DEF_COLORS = {
  blue: '#03A9F4',
  lime: '#0FCED1',
  green: '#4CAF50',
  red: '#FA0719',
  orange: '#FA7807',

  white: '#FFFFFF',
  white1: '#FEFEFE',
  white2: '#FCFCFE',
  white3: '#FBFBFD',
  white4: '#FAFAFC',
  gray: '#F5F5FA',
  gray1: '#D6D6DB',
  gray2: '#BAB8BF',
  gray3: '#99999C',
  gray4: '#7A7A7D',
  gray5: '#5C5C5E',
  gray6: '#3D3D3E',
  gray7: '#1F1F1F',
  black: '#131313',
  black1: '#14171C',

  shadow1: 'box-shadow: 3px 3px 0px 0px rgba(216, 215, 220, 1)',
  shadow2: 'box-shadow: 3px 3px 4px -4px rgba(103, 100, 114, 0.5)',

}
let DEF_SIZE = buildRange({
  type: 'size',
  spread: 1,
  range: 40,
})
let DEV_SPEED = buildRange({
  type: 'speed',
  units: 's',
  spread: 0.25,
  raw: false,
  base: 0.5,
  range: 5,
})

const buildUseConf = update => {
  return Object.entries(DEF_CONFIG)
    .reduce((config, [ key, value ]) => {
      const updateVal = update[key]
      if(!updateVal && updateVal !== false){
        config[key] = DEF_CONFIG[key]
        return config
      }

      config[key] = typeof updateVal === typeof value
        ? updateVal
        : updateVal !== false && DEF_CONFIG[key]

      return config
    }, {})
}

const buildRangeProps = (type, config, postfix='') => {
  const { units, raw, range, spread, base, negative } = config
  return [ ...Array(range) ]
    .reduce((buildObj, _, ind) => {
      const cur =  Math.round( (base + (spread * ind)) * 10 ) / 10
      const name = `${type}${cur}`.replace(
        /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, ''
      )
      units && (buildObj[ name ] = `${cur}${units}${postfix}`)
      negative && (buildObj[ `${name}Neg` ] = `-${cur}${units}${postfix}`)
      raw && (buildObj[ `${name}Raw` ] = cur)
      return buildObj
    }, {})
}

const buildRange = update => {
  const type = update && update.type
  if(!type || typeof type !== 'string') return {}
  
  const useConf = buildUseConf(update)
  const postfix = update.postfix || ''
  const built = buildRangeProps(type, useConf, postfix)
  
  const baseName = `${type}${useConf.base}`.replace(
      /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, ''
    )

  useConf.units &&
    (built[baseName] = `${useConf.base}${useConf.units}${postfix}`)
  useConf.negative &&
    (built[`${baseName}Neg`] = `-${useConf.base}${useConf.units}${postfix}`)
  useConf.raw &&
    (built[`${baseName}Raw`] = useConf.base)

  return built
}

export const updateTheme = ({ theme, config, colors, size, speed }) => {
  if(colors) DEF_COLORS = { ...DEF_COLORS, ...colors }
  if(config) DEF_CONFIG = { ...DEF_CONFIG, ...config }
  if(size) DEF_SIZE = size.type ? buildRange(size) : { ...DEF_SIZE, ...size }
  if(speed) DEV_SPEED = speed.type ? buildRange(speed) : { ...DEF_SIZE, ...speed }
  if(theme) DEF_THEME = { ...DEF_THEME, ...theme }
  
  return getTheme()
}

export const getTheme = () => ({
  size20Neg: "-20px",
  // Fonts
  fontPrimary: `"Raleway", sans-serif`,
  fontSecondary: `"Cabin", sans-serif`,
  fontThird: `"Roboto", sans-serif`,
  fontLite: '300',
  fontNormal: 'normal',
  fontBold: 'bold',

  // Toggle Icon
  toggleHoverColor: DEF_COLORS.blue,
  toggleOpenColor: DEF_COLORS.lime,
  toggleEditColor: DEF_COLORS.green,

  // Item background color
  itemEditBackColor: DEF_COLORS.white,
  itemHoverBackColor: DEF_COLORS.white2,
  itemOpenBackColor: DEF_COLORS.gray,
  itemActiveBackColor: DEF_COLORS.gray,

  // Buttons states
  passiveBtnOpacity: '0',
  activeBtnOpacity: '1',
  passiveBtnColor: DEF_COLORS.gray6,
  activeEditColor: DEF_COLORS.lime,
  activeDragColor: DEF_COLORS.orange,
  activeAddColor: DEF_COLORS.green,
  activeSaveColor: DEF_COLORS.green,
  activeCancelColor: DEF_COLORS.red,
  activeDeleteColor: DEF_COLORS.red,
  
  // Types
  typeLabelColor: DEF_COLORS.gray3,
  
  // Inputs
  inputEditBorder:  `1px solid ${DEF_COLORS.gray1}`,
  inputFocusBorderBottom: `1px solid ${DEF_COLORS.green}`,
  inputErrorBorder: `1px solid ${DEF_COLORS.red}`,
  inputDisabledBackColor: DEF_COLORS.gray1,
  inputDisabledColor: DEF_COLORS.gray3,
  inputDisabledOpacity: 0.5,
  inputDisabledCursor: 'not-allowed',

  // Item
  itemBorder: `2px solid transparent`,
  itemHoverBorder: `2px solid ${DEF_COLORS.blue}`,
  itemEditBorder: `2px solid ${DEF_COLORS.green}`,
  itemEmptyBorder: `2px solid ${DEF_COLORS.green}`,
  itemErrorBorder: `2px solid ${DEF_COLORS.red}`,
  
  headerOpenBorder: `2px solid ${DEF_COLORS.lime}`,

  ...DEF_COLORS,
  ...DEF_SIZE,
  ...DEV_SPEED,
})
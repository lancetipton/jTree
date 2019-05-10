const colors = {
  lightBlue: '#00A5FF',
  robinBlue: '#00c4c9',
  brightGray: '#343B46',
  grayShadow: '#CCC9C9',
  graySand: '#CACBCC',
  iconGray: '#C5C5C5',
  lightGray: '#D8D7DC',
  fadedGray: '#8692a8',
  spanishGray: '#C0BFC4',
  shuttleGray: '#545D6D',
  bunkerBlack: '#13161C',
  ebonyBlack: '#242A35',
  lightBlack: '#565656',
  mirageBlack: '#19202B',

  // Colors
  dullWhite: '#F1EFF5',
  offGray: '#F5F5FA',
  transGray: '#E4E3EA',
  white: '#FFFFFF',
  gray: '#BAB8BF',
  black: '#14171C',

  blue: '#03A9F4',
  lime: '#0FCED1',
  green: '#4CAF50',
  red: '#FA0719',
  orange: '#FA7807',
  lightShadow: 'box-shadow: 3px 3px 0px 0px rgba(216, 215, 220, 1)',
  grayShadow: 'box-shadow: 3px 3px 4px -4px rgba(103, 100, 114, 0.5)',
}

const fonts = {
  // Fonts
  primary: `"Raleway", sans-serif`,
  secondary: `"Cabin", sans-serif`,
  third: `"Roboto", sans-serif`,
}

const speeds = {
  fast: `0.5s`,
  med: `0.9s`,
  slow: `1.3s`,
}

const theme = {
  // Inputs
  inBackground: colors.white,
  inBorder:  `1px solid ${colors.transGray}`,
  inColor:  colors.ebonyBlack,
  inFontSize: '12px',
  
  // Toggle Action
  passiveToggle: colors.ebonyBlack,
  activeToggle: colors.blue,
  openToggle: colors.orange,
  toggleIconSpeed: `0.5s`,
  toggleSize: `16px`,
  toggleSpacer: '10px',
  
  // Lists / Rows
  listToggleSpeed: speeds.fast,
  rowIndent: '10px',
  rowHeaderIndent: "-10px",
  subRowIndent: '20px',
  subHeaderRowIndent: "-20px",
  rowShadow: colors.lightShadow,
  
  // Color states
  passiveBack: colors.white,
  // Group of items background color
  passiveGroupBack: colors.white,
  activeGroupBack: colors.offGray,
  openGroupBack: colors.white,
  // Single Item background color
  passiveItemBack: colors.white,
  hoverItemBack: colors.offGray,
  
  // Buttons states
  passiveBtn: colors.ebonyBlack,
  activeEdit: colors.lime,
  activeDrag: colors.blue,
  activeAdd: colors.green,
  activeSave: colors.green,
  activeCancel: colors.red,
  activeDelete: colors.red,
  actionBtnFont: fonts.primary,
  actionBtnSpeed: speeds.fast,
  
  // Types
  typeLabelColor: colors.fadedGray,
  typeLabelSize: '10px',
  
  
  // Item
  itemKeyFont: fonts.third,
  itemKeyFontWeight: 'bold',
  itemValFont: fonts.third,
  itemValFontWeight: 'normal',
  itemTransSpeed: speeds.fast,
  itemColor: colors.ebonyBlack,
  itemBorder: `2px solid transparent`,
  itemHoverBorder: `2px solid ${colors.ebonyBlack}`,
  itemEditBorder: `2px solid ${colors.lime}`,
  itemEmptyBorder: `2px solid ${colors.orange}`,
  
  
  // Sizes
  headerSize: '14px',
  keySize: '12px',
  valueSize: '12px',
  
  // Speeds
  toggleIconSpeed: speeds.fast,
  
  // Disabled
  disabledInput: colors.offGray,
}


export default theme
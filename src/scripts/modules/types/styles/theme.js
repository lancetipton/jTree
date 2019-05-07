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
  white: '#FFFFFF',
  gray: '#BFBEC3',
  black: '#14171C',

  blue: '#03A9F4',
  lime: '#0FCED1',
  green: '#4CAF50',
  red: '#FA0719',
  orange: '#FA7807',
}

const theme = {
  // Inputs
  inBackground: colors.white,
  inBorder:  `1px solid ${colors.lightGray}`,
  inColor:  colors.lightBlack,
  inFontSize: '12px',
  
  // Toggle Action
  passiveToggle: colors.blue,
  activeToggle: colors.orange,
  
  // color states
  passiveBack: colors.white,
  // Group of items background color
  passiveGroupBack: colors.white,
  activeGroupBack: colors.dullWhite,
  openGroupBack: colors.white,
  // Single Item background color
  passiveItemBack: colors.white,
  hoverItemBack: colors.dullWhite,
  
  // Buttons states
  passiveBtn: colors.lightBlack,
  activeEdit: colors.lime,
  activeDrag: colors.blue,
  activeSave: colors.green,
  activeCancel: colors.red,
  activeDelete: colors.red,
  
  // Types
  typeLabelColor: colors.fadedGray,
  typeLabelSize: '10px',
  
  // Sizes
  headerSize: '14px',
  keySize: '12px',
  valueSize: '12px',
  
  // Speeds
  easeSpeed: `0.5s`,
  // Fonts
  raleway: `"Raleway", sans-serif`,
  cabin: `"Cabin", sans-serif`,
  roboto: `"Roboto", sans-serif`,

}


export default theme
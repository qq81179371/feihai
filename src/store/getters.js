const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  uu: state => state.user.uu,
  ui: state => state.user.ui,
  avatar: state => state.user.avatar,
  schoolName: state => state.user.schoolName,
  name: state => state.user.name,
  authorityList: state => state.user.authorityList,
  baudrateList: state => state.user.baudrateList,
  customIcon: state => state.user.customIcon,
  weekText: state => state.user.weekText,
  schoolLogo: state => state.user.schoolLogo,
  menus: state => state.user.menus,
  source: state => state.user.source,
  weekList: state => state.user.weekList
}
export default getters

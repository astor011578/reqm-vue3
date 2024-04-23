const setting = {
  /**
   * @description the title of website
   */
  title: 'ReqM',

  //* layout-related *//
  /**
   * @description whether show the left-sidebar
   * @type { boolean } true | false
   */
  showLeftMenu: true,
  /**
   * @description 
   * @type { number }
   */
  triggerResizeWidth: 992,
  
  //* animation-related *//
  /**
   * @description whether need to use NProgress
   * @type { boolean } true || false
   */
  isNeedNprogress: true,

  //* login and permission related *//
  /**
   * @description the default language setting for i18n
   * @type { string } 'zh' || 'en'
   */
  defaultLanguage: 'en',

  //* Others *//
  /**
   * @description whether need to show error-logs component
   * If you want to also use it in dev, you can pass ['dev', 'test']
   * @type { string | string[] } 'dev' || ['prod', 'test', 'dev'] according to the .env file props of VITE_APP_ENV
   */
  errorLog: ['prod', 'test'],
  /**
   * vite.config.js base config
   * such as './'
   */
  // viteBasePath: './'             //for development environment
  viteBasePath: '/reqm-vue3/'     //to deploy to GitHub Pages
}

export default setting

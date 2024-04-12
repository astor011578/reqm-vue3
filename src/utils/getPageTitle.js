import defaultSettings from '@/settings'

const title = defaultSettings.title || 'ReqM'

export default function getPageTitle(pageTitle) {
  return pageTitle ? `${pageTitle} - ${title}` : `${title}`
}

//the ts file of vuex
import { RouterTy } from '@/types/router';
import { ObjTy } from '@/types/common';

export interface StateTy {
  app: AppTy;
  permission: PermissionTy;
  user: UserTy;
}
export interface UserTy {
  username: string;
  avatar: string;
  roles: Array<string>;
}
export interface AppTy {
  sidebar: {
    opened: boolean;
    // opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    // withoutAnimation: false
  };
  device: string;
  settings: ObjTy;
  cachedViews: Array<string>;
  cachedViewsDeep: Array<string>;
}
export interface PermissionTy {
  isGetUserInfo: boolean;  //是否已設置權限
  routes: RouterTy;        //集合過濾後的非同步路由和靜態路由
  addRoutes: RouterTy;     //過濾後的非同步路由
}

import Analytics from "./Dashboard/Analytics";
import Articles from "./Dashboard/Articles";
import Create from "./Dashboard/Articles/Article/Create";
import Edit from "./Dashboard/Articles/Article/Edit";
import DownloadReport from "./Dashboard/DownloadReport";
import Eui from "./EUI";

export const DASHBOARD_PATH = "/";
export const ARTICLE_CREATE_PATH = "/article/create";
export const ARTICLE_EDIT_PATH = "/article/:id/edit";
export const SETTINGS_PATH = "/settings";
export const EUI_PATH = "/public";
export const ANALYTICS_PATH = "/analytics";
export const DOWNLOAD_REPORT_PATH = "/articles/report";

export const DASHBOARD_ROUTES = [
  {
    path: DASHBOARD_PATH,
    component: Articles,
  },
  {
    path: ARTICLE_CREATE_PATH,
    component: Create,
  },
  {
    path: ARTICLE_EDIT_PATH,
    component: Edit,
  },
  {
    path: EUI_PATH,
    component: Eui,
  },
  {
    path: ANALYTICS_PATH,
    component: Analytics,
  },
  {
    path: DOWNLOAD_REPORT_PATH,
    component: DownloadReport,
  },
];

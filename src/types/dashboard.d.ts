export interface DashboardPanel {
  id: number;
  title: string;
  type: string;
  [key: string]: any;
}

export interface DashboardResponse {
  dashboard: {
    panels: DashboardPanel[];
  };
}

export interface SimplifiedPanel {
  id: number;
  title: string;
  type: string;
}

export interface DashboardListItem {
  id: number;
  uid: string;
  title: string;
  uri: string;
  url: string;
  slug: string;
  type: string;
  tags: string[];
  isStarred: boolean;
  folderId: number;
  folderUid: string;
  folderTitle: string;
  folderUrl: string;
  sortMeta: number;
}

export interface SimplifiedDashboardItem {
  id: number;
  uid: string;
  title: string;
  uri: string;
  tags: string[];
}

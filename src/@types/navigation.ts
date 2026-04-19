import { ReactNode } from 'react';

export interface NavigationTree {
  key: string;
  path: string;
  title: string;
  translateKey: string;
  icon: any;
  type?: 'title' | 'collapse' | 'item' | 'drawer';
  authority: string[];
  subMenu?: SubMenuNavigationTree[];
  drawer?: ReactNode;
}

export interface SubMenuNavigationTree {
  key: string;
  path: string;
  authority: string[];
  title: string;
  translateKey: string;
  icon: any;
}

import { combineReducers, AnyAction, Reducer, Action } from 'redux';
import auth, { AuthState } from './slices/auth';
import base, { BaseState } from './slices/base';

import locale, { LocaleState } from './slices/locale/localeSlice';
import theme, { ThemeState } from './slices/theme/themeSlice';
import cacheReducer, { CachedDataState } from './slices/cache/cacheSlice';
// import { api } from '@/services/Service';

export type RootState = {
  auth: AuthState;
  base: BaseState;
  locale: LocaleState;
  theme: ThemeState;
  cache: CachedDataState<any>;
  // api: any;
  /* eslint-disable @typescript-eslint/no-explicit-any */
};

export interface AsyncReducers {
  [key: string]: Reducer<any, AnyAction>;
}

const staticReducers = {
  auth,
  base,
  locale,
  theme,
  cache: cacheReducer,
};

const rootReducer =
  (asyncReducers?: AsyncReducers) => (state: RootState, action: Action) => {
    const combinedReducer = combineReducers({
      ...staticReducers,
      ...asyncReducers,
      // [api.reducerPath]: api.reducer,
    });

    return combinedReducer(state, action);
  };

export default rootReducer;

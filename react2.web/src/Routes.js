import React from 'react';
import { Switch, Redirect,Route } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout, Collab as CollabLayout } from './layouts';

import {
  AuthManageHome as AuthManageHomeView,
  SignUp as SignUpView,
  SignIn as SignInView,
  Landing as LandingView,
  AccountStatus as AccountStatusView,
  AppDownload as AppDownloadView,
} from './views/Auth';

import {
  Dashboard as Collab_DashboardView,
  MyTasks as MyTasksView,
  Inbox as InboxView,
  ProfileSetting as ProfileSettingView,
  AddProject as AddProjectView,
  EditProject as EditProjectView,
  ProjectPage as ProjectPageView
} from './views/Collab';

const Routes = () => {
  return (
    <Switch>
      {/* <Redirect
        exact
        from="/"
        to="/sign-in"
      /> */}
      {/* <RouteWithLayout
        component={AuthManageHomeView}
        exact
        layout={MainLayout}
        path="/auth_manage"
      /> */}
      <RouteWithLayout
        component={SignUpView}
        exact
        cur_module = 'Klipspruit Colliery'
        layout={MinimalLayout}
        path="/register"
      />
      <RouteWithLayout
        component={SignInView}
        exact
        cur_module = 'Klipspruit Colliery'
        layout={MinimalLayout}
        path="/sign-in"
      />
      {/* <RouteWithLayout
        component={AccountStatusView}
        exact
        layout={MinimalLayout}
        path="/account_status"
      />
      <RouteWithLayout
        component={AppDownloadView}
        exact
        layout={MinimalLayout}
        path="/app_download"
      /> */}
      <RouteWithLayout
        component={Collab_DashboardView}
        exact
        cur_module = 'COLLABORATION'
        layout={CollabLayout}
        path="/collab_dashboard"
      />
      <RouteWithLayout
        component={MyTasksView}
        exact
        cur_module = 'COLLABORATION'
        layout={CollabLayout}
        path="/collab_mytasks"
      />
      <RouteWithLayout
        component={InboxView}
        cur_module = 'COLLABORATION'
        layout={CollabLayout}
        path="/collab_inbox"
      />
      <RouteWithLayout
        component={ProfileSettingView}
        cur_module = 'COLLABORATION'
        layout={CollabLayout}
        path="/collab_setting"
      />
      <RouteWithLayout
        component={AddProjectView}
        cur_module = 'COLLABORATION'
        layout={CollabLayout}
        path="/collab_addproject"
      />
      <RouteWithLayout
        component={EditProjectView}
        cur_module = 'COLLABORATION'
        layout={CollabLayout}
        path="/collab_editproject"
      />
      <RouteWithLayout
        component={ProjectPageView}
        cur_module = 'COLLABORATION'
        layout={CollabLayout}
        path="/collab_project"
      />
      <RouteWithLayout
        component={ProjectPageView}
        cur_module = 'COLLABORATION'
        layout={CollabLayout}
        path="/collab_invited_project"
      />
      <Route exact path="/">
        <LandingView />
      </Route>
    </Switch>
  );
};

export default Routes;

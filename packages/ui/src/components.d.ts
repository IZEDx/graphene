/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import {
  Breadcrumbs,
} from './components/elements/breadcrumbs/model';
import {
  ClassList,
} from './libs/utils';
import {
  LocationSegments,
  MatchResults,
  RouteRenderProps,
  RouterHistory,
} from '@stencil/router';
import {
  Category,
  MenuItem,
} from './components/elements/menu/model';

export namespace Components {
  interface GelBreadcrumbs {
    'anchorClass': ClassList;
    'breadcrumbClass': ClassList;
    'breadcrumbs': Breadcrumbs;
  }
  interface GelForm {}
  interface GelInputSelect {
    'disabled'?: boolean;
    'formKey': string;
    'label'?: string;
    'options': {name: string, value: string}[];
    'selectClass': string|Record<string, boolean>;
    'value'?: string;
  }
  interface GelInputSwitch {
    'disabled'?: boolean;
    'formKey': string;
    'inputClass': string|Record<string, boolean>;
    'label'?: string;
    'value'?: boolean;
  }
  interface GelInputText {
    'disabled'?: boolean;
    'formKey': string;
    'inputClass': string|Record<string, boolean>;
    'label'?: string;
    'placeholder'?: string;
    'type': string;
    'value'?: string;
  }
  interface GelMenu {
    'anchorClass': ClassList;
    'categories': Category[];
    'categoryClass': ClassList;
    'history': RouterHistory;
    'listClass': ClassList;
    'location': LocationSegments;
    'menuClass': ClassList;
  }
  interface GelTable {
    'columns': string[];
    'history': RouterHistory;
    'linkTo'?: (row: any, idx: number) => any;
    'rows': any[];
  }
  interface GrapheneNav {}
  interface GrapheneUi {
    'endPoint': string;
    'token': string;
  }
  interface UtilRouteListener {
    'props': RouteRenderProps | undefined;
  }
  interface ViewDashboard {}
  interface ViewEdit {
    'match': MatchResults;
  }
  interface ViewList {
    'columnCount': number;
    'match': MatchResults;
  }
}

declare global {


  interface HTMLGelBreadcrumbsElement extends Components.GelBreadcrumbs, HTMLStencilElement {}
  var HTMLGelBreadcrumbsElement: {
    prototype: HTMLGelBreadcrumbsElement;
    new (): HTMLGelBreadcrumbsElement;
  };

  interface HTMLGelFormElement extends Components.GelForm, HTMLStencilElement {}
  var HTMLGelFormElement: {
    prototype: HTMLGelFormElement;
    new (): HTMLGelFormElement;
  };

  interface HTMLGelInputSelectElement extends Components.GelInputSelect, HTMLStencilElement {}
  var HTMLGelInputSelectElement: {
    prototype: HTMLGelInputSelectElement;
    new (): HTMLGelInputSelectElement;
  };

  interface HTMLGelInputSwitchElement extends Components.GelInputSwitch, HTMLStencilElement {}
  var HTMLGelInputSwitchElement: {
    prototype: HTMLGelInputSwitchElement;
    new (): HTMLGelInputSwitchElement;
  };

  interface HTMLGelInputTextElement extends Components.GelInputText, HTMLStencilElement {}
  var HTMLGelInputTextElement: {
    prototype: HTMLGelInputTextElement;
    new (): HTMLGelInputTextElement;
  };

  interface HTMLGelMenuElement extends Components.GelMenu, HTMLStencilElement {}
  var HTMLGelMenuElement: {
    prototype: HTMLGelMenuElement;
    new (): HTMLGelMenuElement;
  };

  interface HTMLGelTableElement extends Components.GelTable, HTMLStencilElement {}
  var HTMLGelTableElement: {
    prototype: HTMLGelTableElement;
    new (): HTMLGelTableElement;
  };

  interface HTMLGrapheneNavElement extends Components.GrapheneNav, HTMLStencilElement {}
  var HTMLGrapheneNavElement: {
    prototype: HTMLGrapheneNavElement;
    new (): HTMLGrapheneNavElement;
  };

  interface HTMLGrapheneUiElement extends Components.GrapheneUi, HTMLStencilElement {}
  var HTMLGrapheneUiElement: {
    prototype: HTMLGrapheneUiElement;
    new (): HTMLGrapheneUiElement;
  };

  interface HTMLUtilRouteListenerElement extends Components.UtilRouteListener, HTMLStencilElement {}
  var HTMLUtilRouteListenerElement: {
    prototype: HTMLUtilRouteListenerElement;
    new (): HTMLUtilRouteListenerElement;
  };

  interface HTMLViewDashboardElement extends Components.ViewDashboard, HTMLStencilElement {}
  var HTMLViewDashboardElement: {
    prototype: HTMLViewDashboardElement;
    new (): HTMLViewDashboardElement;
  };

  interface HTMLViewEditElement extends Components.ViewEdit, HTMLStencilElement {}
  var HTMLViewEditElement: {
    prototype: HTMLViewEditElement;
    new (): HTMLViewEditElement;
  };

  interface HTMLViewListElement extends Components.ViewList, HTMLStencilElement {}
  var HTMLViewListElement: {
    prototype: HTMLViewListElement;
    new (): HTMLViewListElement;
  };
  interface HTMLElementTagNameMap {
    'gel-breadcrumbs': HTMLGelBreadcrumbsElement;
    'gel-form': HTMLGelFormElement;
    'gel-input-select': HTMLGelInputSelectElement;
    'gel-input-switch': HTMLGelInputSwitchElement;
    'gel-input-text': HTMLGelInputTextElement;
    'gel-menu': HTMLGelMenuElement;
    'gel-table': HTMLGelTableElement;
    'graphene-nav': HTMLGrapheneNavElement;
    'graphene-ui': HTMLGrapheneUiElement;
    'util-route-listener': HTMLUtilRouteListenerElement;
    'view-dashboard': HTMLViewDashboardElement;
    'view-edit': HTMLViewEditElement;
    'view-list': HTMLViewListElement;
  }
}

declare namespace LocalJSX {
  interface GelBreadcrumbs {
    'anchorClass'?: ClassList;
    'breadcrumbClass'?: ClassList;
    'breadcrumbs'?: Breadcrumbs;
  }
  interface GelForm {}
  interface GelInputSelect {
    'disabled'?: boolean;
    'formKey'?: string;
    'label'?: string;
    'onInputUpdate'?: (event: CustomEvent<{formKey: string, value: any}>) => void;
    'options'?: {name: string, value: string}[];
    'selectClass'?: string|Record<string, boolean>;
    'value'?: string;
  }
  interface GelInputSwitch {
    'disabled'?: boolean;
    'formKey'?: string;
    'inputClass'?: string|Record<string, boolean>;
    'label'?: string;
    'onInputUpdate'?: (event: CustomEvent<{formKey: string, value: any}>) => void;
    'value'?: boolean;
  }
  interface GelInputText {
    'disabled'?: boolean;
    'formKey'?: string;
    'inputClass'?: string|Record<string, boolean>;
    'label'?: string;
    'onInputUpdate'?: (event: CustomEvent<{formKey: string, value: any}>) => void;
    'placeholder'?: string;
    'type'?: string;
    'value'?: string;
  }
  interface GelMenu {
    'anchorClass'?: ClassList;
    'categories'?: Category[];
    'categoryClass'?: ClassList;
    'history'?: RouterHistory;
    'listClass'?: ClassList;
    'location'?: LocationSegments;
    'menuClass'?: ClassList;
    'onNavigate'?: (event: CustomEvent<MenuItem>) => void;
  }
  interface GelTable {
    'columns'?: string[];
    'history'?: RouterHistory;
    'linkTo'?: (row: any, idx: number) => any;
    'rows'?: any[];
  }
  interface GrapheneNav {}
  interface GrapheneUi {
    'endPoint'?: string;
    'token'?: string;
  }
  interface UtilRouteListener {
    'onPageDidUpdate'?: (event: CustomEvent<LocationSegments>) => void;
    'onPageEnter'?: (event: CustomEvent<LocationSegments>) => void;
    'onPageLeave'?: (event: CustomEvent<LocationSegments>) => void;
    'onPageWillUpdate'?: (event: CustomEvent<LocationSegments>) => void;
    'props'?: RouteRenderProps | undefined;
  }
  interface ViewDashboard {
    'onPushBreadcrumb'?: (event: CustomEvent<[string, string]>) => void;
  }
  interface ViewEdit {
    'match'?: MatchResults;
    'onClearBreadcrumb'?: (event: CustomEvent<void>) => void;
    'onPushBreadcrumb'?: (event: CustomEvent<[string, string]>) => void;
  }
  interface ViewList {
    'columnCount'?: number;
    'match'?: MatchResults;
    'onClearBreadcrumb'?: (event: CustomEvent<void>) => void;
    'onPushBreadcrumb'?: (event: CustomEvent<[string, string]>) => void;
  }

  interface IntrinsicElements {
    'gel-breadcrumbs': GelBreadcrumbs;
    'gel-form': GelForm;
    'gel-input-select': GelInputSelect;
    'gel-input-switch': GelInputSwitch;
    'gel-input-text': GelInputText;
    'gel-menu': GelMenu;
    'gel-table': GelTable;
    'graphene-nav': GrapheneNav;
    'graphene-ui': GrapheneUi;
    'util-route-listener': UtilRouteListener;
    'view-dashboard': ViewDashboard;
    'view-edit': ViewEdit;
    'view-list': ViewList;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'gel-breadcrumbs': LocalJSX.GelBreadcrumbs & JSXBase.HTMLAttributes<HTMLGelBreadcrumbsElement>;
      'gel-form': LocalJSX.GelForm & JSXBase.HTMLAttributes<HTMLGelFormElement>;
      'gel-input-select': LocalJSX.GelInputSelect & JSXBase.HTMLAttributes<HTMLGelInputSelectElement>;
      'gel-input-switch': LocalJSX.GelInputSwitch & JSXBase.HTMLAttributes<HTMLGelInputSwitchElement>;
      'gel-input-text': LocalJSX.GelInputText & JSXBase.HTMLAttributes<HTMLGelInputTextElement>;
      'gel-menu': LocalJSX.GelMenu & JSXBase.HTMLAttributes<HTMLGelMenuElement>;
      'gel-table': LocalJSX.GelTable & JSXBase.HTMLAttributes<HTMLGelTableElement>;
      'graphene-nav': LocalJSX.GrapheneNav & JSXBase.HTMLAttributes<HTMLGrapheneNavElement>;
      'graphene-ui': LocalJSX.GrapheneUi & JSXBase.HTMLAttributes<HTMLGrapheneUiElement>;
      'util-route-listener': LocalJSX.UtilRouteListener & JSXBase.HTMLAttributes<HTMLUtilRouteListenerElement>;
      'view-dashboard': LocalJSX.ViewDashboard & JSXBase.HTMLAttributes<HTMLViewDashboardElement>;
      'view-edit': LocalJSX.ViewEdit & JSXBase.HTMLAttributes<HTMLViewEditElement>;
      'view-list': LocalJSX.ViewList & JSXBase.HTMLAttributes<HTMLViewListElement>;
    }
  }
}



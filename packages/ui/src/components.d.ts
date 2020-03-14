/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { LocationSegments, MatchResults, RouteRenderProps, RouterHistory, } from "@stencil/router";
import { GrapheneObjectType, GrapheneQueryField, } from "./libs/graphene";
import { ClassList, } from "./libs/utils";
import { Category, MenuItem, } from "./components/elements/menu/model";
export namespace Components {
    interface BreadcrumbProvider {
    }
    interface ContentCreate {
    }
    interface ContentDelete {
        "history": RouterHistory;
        "params": Record<string, string | number> | undefined;
    }
    interface ContentEdit {
        "history": RouterHistory;
        "params": Record<string, string | number> | undefined;
        "preferredColumns": string[];
        "readonlyColumns": string[];
    }
    interface ContentList {
        "columnCount": number;
        "definition": GrapheneQueryField<GrapheneObjectType>;
        "history": RouterHistory;
        "preferredColumns": string[];
        "preferredEndColumns": string[];
    }
    interface GelBreadcrumbs {
        "anchorClass": ClassList;
        "breadcrumbClass": ClassList;
    }
    interface GelForm {
    }
    interface GelInputRich {
        "disabled"?: boolean;
        "formKey": string;
        "label"?: string;
        "value"?: string;
    }
    interface GelInputSelect {
        "disabled"?: boolean;
        "formKey": string;
        "label"?: string;
        "options": {
            name: string;
            value: string;
        }[];
        "selectClass": string | Record<string, boolean>;
        "value"?: string;
    }
    interface GelInputSwitch {
        "disabled"?: boolean;
        "formKey": string;
        "inputClass": string | Record<string, boolean>;
        "label"?: string;
        "value"?: boolean;
    }
    interface GelInputText {
        "autoComplete": string;
        "disabled"?: boolean;
        "formKey": string;
        "inputClass": string | Record<string, boolean>;
        "label"?: string;
        "placeholder"?: string;
        "type": string;
        "value"?: string;
    }
    interface GelMenu {
        "anchorClass": ClassList;
        "categories": Category[];
        "categoryClass": ClassList;
        "history": RouterHistory;
        "listClass": ClassList;
        "location": LocationSegments;
        "menuClass": ClassList;
    }
    interface GelTable {
        "columns": string[];
        "history": RouterHistory;
        "linkTo"?: (row: any) => any;
        "order": "ASC" | "DESC";
        "rows": any[];
        "sortBy": string;
    }
    interface GrapheneNav {
    }
    interface GrapheneProvider {
        "endPoint": string;
        "token"?: string;
    }
    interface GrapheneUi {
        "endPoint": string;
        "token"?: string;
    }
    interface NotificationProvider {
    }
    interface UtilGuard {
    }
    interface UtilRouteListener {
        "props": RouteRenderProps | undefined;
    }
    interface ViewContent {
        "isCreate"?: boolean;
        "isDelete"?: boolean;
        "isEdit"?: boolean;
        "match": MatchResults;
    }
    interface ViewDashboard {
    }
    interface ViewLogin {
    }
    interface ViewLogout {
    }
}
declare global {
    interface HTMLBreadcrumbProviderElement extends Components.BreadcrumbProvider, HTMLStencilElement {
    }
    var HTMLBreadcrumbProviderElement: {
        prototype: HTMLBreadcrumbProviderElement;
        new (): HTMLBreadcrumbProviderElement;
    };
    interface HTMLContentCreateElement extends Components.ContentCreate, HTMLStencilElement {
    }
    var HTMLContentCreateElement: {
        prototype: HTMLContentCreateElement;
        new (): HTMLContentCreateElement;
    };
    interface HTMLContentDeleteElement extends Components.ContentDelete, HTMLStencilElement {
    }
    var HTMLContentDeleteElement: {
        prototype: HTMLContentDeleteElement;
        new (): HTMLContentDeleteElement;
    };
    interface HTMLContentEditElement extends Components.ContentEdit, HTMLStencilElement {
    }
    var HTMLContentEditElement: {
        prototype: HTMLContentEditElement;
        new (): HTMLContentEditElement;
    };
    interface HTMLContentListElement extends Components.ContentList, HTMLStencilElement {
    }
    var HTMLContentListElement: {
        prototype: HTMLContentListElement;
        new (): HTMLContentListElement;
    };
    interface HTMLGelBreadcrumbsElement extends Components.GelBreadcrumbs, HTMLStencilElement {
    }
    var HTMLGelBreadcrumbsElement: {
        prototype: HTMLGelBreadcrumbsElement;
        new (): HTMLGelBreadcrumbsElement;
    };
    interface HTMLGelFormElement extends Components.GelForm, HTMLStencilElement {
    }
    var HTMLGelFormElement: {
        prototype: HTMLGelFormElement;
        new (): HTMLGelFormElement;
    };
    interface HTMLGelInputRichElement extends Components.GelInputRich, HTMLStencilElement {
    }
    var HTMLGelInputRichElement: {
        prototype: HTMLGelInputRichElement;
        new (): HTMLGelInputRichElement;
    };
    interface HTMLGelInputSelectElement extends Components.GelInputSelect, HTMLStencilElement {
    }
    var HTMLGelInputSelectElement: {
        prototype: HTMLGelInputSelectElement;
        new (): HTMLGelInputSelectElement;
    };
    interface HTMLGelInputSwitchElement extends Components.GelInputSwitch, HTMLStencilElement {
    }
    var HTMLGelInputSwitchElement: {
        prototype: HTMLGelInputSwitchElement;
        new (): HTMLGelInputSwitchElement;
    };
    interface HTMLGelInputTextElement extends Components.GelInputText, HTMLStencilElement {
    }
    var HTMLGelInputTextElement: {
        prototype: HTMLGelInputTextElement;
        new (): HTMLGelInputTextElement;
    };
    interface HTMLGelMenuElement extends Components.GelMenu, HTMLStencilElement {
    }
    var HTMLGelMenuElement: {
        prototype: HTMLGelMenuElement;
        new (): HTMLGelMenuElement;
    };
    interface HTMLGelTableElement extends Components.GelTable, HTMLStencilElement {
    }
    var HTMLGelTableElement: {
        prototype: HTMLGelTableElement;
        new (): HTMLGelTableElement;
    };
    interface HTMLGrapheneNavElement extends Components.GrapheneNav, HTMLStencilElement {
    }
    var HTMLGrapheneNavElement: {
        prototype: HTMLGrapheneNavElement;
        new (): HTMLGrapheneNavElement;
    };
    interface HTMLGrapheneProviderElement extends Components.GrapheneProvider, HTMLStencilElement {
    }
    var HTMLGrapheneProviderElement: {
        prototype: HTMLGrapheneProviderElement;
        new (): HTMLGrapheneProviderElement;
    };
    interface HTMLGrapheneUiElement extends Components.GrapheneUi, HTMLStencilElement {
    }
    var HTMLGrapheneUiElement: {
        prototype: HTMLGrapheneUiElement;
        new (): HTMLGrapheneUiElement;
    };
    interface HTMLNotificationProviderElement extends Components.NotificationProvider, HTMLStencilElement {
    }
    var HTMLNotificationProviderElement: {
        prototype: HTMLNotificationProviderElement;
        new (): HTMLNotificationProviderElement;
    };
    interface HTMLUtilGuardElement extends Components.UtilGuard, HTMLStencilElement {
    }
    var HTMLUtilGuardElement: {
        prototype: HTMLUtilGuardElement;
        new (): HTMLUtilGuardElement;
    };
    interface HTMLUtilRouteListenerElement extends Components.UtilRouteListener, HTMLStencilElement {
    }
    var HTMLUtilRouteListenerElement: {
        prototype: HTMLUtilRouteListenerElement;
        new (): HTMLUtilRouteListenerElement;
    };
    interface HTMLViewContentElement extends Components.ViewContent, HTMLStencilElement {
    }
    var HTMLViewContentElement: {
        prototype: HTMLViewContentElement;
        new (): HTMLViewContentElement;
    };
    interface HTMLViewDashboardElement extends Components.ViewDashboard, HTMLStencilElement {
    }
    var HTMLViewDashboardElement: {
        prototype: HTMLViewDashboardElement;
        new (): HTMLViewDashboardElement;
    };
    interface HTMLViewLoginElement extends Components.ViewLogin, HTMLStencilElement {
    }
    var HTMLViewLoginElement: {
        prototype: HTMLViewLoginElement;
        new (): HTMLViewLoginElement;
    };
    interface HTMLViewLogoutElement extends Components.ViewLogout, HTMLStencilElement {
    }
    var HTMLViewLogoutElement: {
        prototype: HTMLViewLogoutElement;
        new (): HTMLViewLogoutElement;
    };
    interface HTMLElementTagNameMap {
        "breadcrumb-provider": HTMLBreadcrumbProviderElement;
        "content-create": HTMLContentCreateElement;
        "content-delete": HTMLContentDeleteElement;
        "content-edit": HTMLContentEditElement;
        "content-list": HTMLContentListElement;
        "gel-breadcrumbs": HTMLGelBreadcrumbsElement;
        "gel-form": HTMLGelFormElement;
        "gel-input-rich": HTMLGelInputRichElement;
        "gel-input-select": HTMLGelInputSelectElement;
        "gel-input-switch": HTMLGelInputSwitchElement;
        "gel-input-text": HTMLGelInputTextElement;
        "gel-menu": HTMLGelMenuElement;
        "gel-table": HTMLGelTableElement;
        "graphene-nav": HTMLGrapheneNavElement;
        "graphene-provider": HTMLGrapheneProviderElement;
        "graphene-ui": HTMLGrapheneUiElement;
        "notification-provider": HTMLNotificationProviderElement;
        "util-guard": HTMLUtilGuardElement;
        "util-route-listener": HTMLUtilRouteListenerElement;
        "view-content": HTMLViewContentElement;
        "view-dashboard": HTMLViewDashboardElement;
        "view-login": HTMLViewLoginElement;
        "view-logout": HTMLViewLogoutElement;
    }
}
declare namespace LocalJSX {
    interface BreadcrumbProvider {
    }
    interface ContentCreate {
    }
    interface ContentDelete {
        "history"?: RouterHistory;
        "onApiError"?: (event: CustomEvent<any>) => void;
        "onSuccessToast"?: (event: CustomEvent<string>) => void;
        "params"?: Record<string, string | number> | undefined;
    }
    interface ContentEdit {
        "history"?: RouterHistory;
        "onApiError"?: (event: CustomEvent<any>) => void;
        "onSuccessToast"?: (event: CustomEvent<string>) => void;
        "params"?: Record<string, string | number> | undefined;
        "preferredColumns"?: string[];
        "readonlyColumns"?: string[];
    }
    interface ContentList {
        "columnCount"?: number;
        "definition"?: GrapheneQueryField<GrapheneObjectType>;
        "history"?: RouterHistory;
        "preferredColumns"?: string[];
        "preferredEndColumns"?: string[];
    }
    interface GelBreadcrumbs {
        "anchorClass"?: ClassList;
        "breadcrumbClass"?: ClassList;
    }
    interface GelForm {
    }
    interface GelInputRich {
        "disabled"?: boolean;
        "formKey"?: string;
        "label"?: string;
        "onInputUpdate"?: (event: CustomEvent<{
            formKey: string;
            value: any;
        }>) => void;
        "value"?: string;
    }
    interface GelInputSelect {
        "disabled"?: boolean;
        "formKey"?: string;
        "label"?: string;
        "onInputUpdate"?: (event: CustomEvent<{
            formKey: string;
            value: any;
        }>) => void;
        "options"?: {
            name: string;
            value: string;
        }[];
        "selectClass"?: string | Record<string, boolean>;
        "value"?: string;
    }
    interface GelInputSwitch {
        "disabled"?: boolean;
        "formKey"?: string;
        "inputClass"?: string | Record<string, boolean>;
        "label"?: string;
        "onInputUpdate"?: (event: CustomEvent<{
            formKey: string;
            value: any;
        }>) => void;
        "value"?: boolean;
    }
    interface GelInputText {
        "autoComplete"?: string;
        "disabled"?: boolean;
        "formKey"?: string;
        "inputClass"?: string | Record<string, boolean>;
        "label"?: string;
        "onInputUpdate"?: (event: CustomEvent<{
            formKey: string;
            value: any;
        }>) => void;
        "placeholder"?: string;
        "type"?: string;
        "value"?: string;
    }
    interface GelMenu {
        "anchorClass"?: ClassList;
        "categories"?: Category[];
        "categoryClass"?: ClassList;
        "history"?: RouterHistory;
        "listClass"?: ClassList;
        "location"?: LocationSegments;
        "menuClass"?: ClassList;
        "onNavigate"?: (event: CustomEvent<MenuItem>) => void;
    }
    interface GelTable {
        "columns"?: string[];
        "history"?: RouterHistory;
        "linkTo"?: (row: any) => any;
        "order"?: "ASC" | "DESC";
        "rows"?: any[];
        "sortBy"?: string;
    }
    interface GrapheneNav {
    }
    interface GrapheneProvider {
        "endPoint"?: string;
        "onErrorToast"?: (event: CustomEvent<string>) => void;
        "onSuccessToast"?: (event: CustomEvent<string>) => void;
        "onToggleBackground"?: (event: CustomEvent<boolean>) => void;
        "token"?: string;
    }
    interface GrapheneUi {
        "endPoint"?: string;
        "token"?: string;
    }
    interface NotificationProvider {
    }
    interface UtilGuard {
    }
    interface UtilRouteListener {
        "onPageDidUpdate"?: (event: CustomEvent<LocationSegments>) => void;
        "onPageEnter"?: (event: CustomEvent<LocationSegments>) => void;
        "onPageLeave"?: (event: CustomEvent<LocationSegments>) => void;
        "onPageWillUpdate"?: (event: CustomEvent<LocationSegments>) => void;
        "props"?: RouteRenderProps | undefined;
    }
    interface ViewContent {
        "isCreate"?: boolean;
        "isDelete"?: boolean;
        "isEdit"?: boolean;
        "match"?: MatchResults;
        "onClearBreadcrumb"?: (event: CustomEvent<void>) => void;
        "onPushBreadcrumb"?: (event: CustomEvent<[string, string]>) => void;
    }
    interface ViewDashboard {
        "onPushBreadcrumb"?: (event: CustomEvent<[string, string]>) => void;
    }
    interface ViewLogin {
        "onClearBreadcrumb"?: (event: CustomEvent<void>) => void;
        "onLogin"?: (event: CustomEvent<{
            name: string;
            password: string;
        }>) => void;
        "onPushBreadcrumb"?: (event: CustomEvent<[string, string]>) => void;
    }
    interface ViewLogout {
        "onClearBreadcrumb"?: (event: CustomEvent<void>) => void;
        "onLogout"?: (event: CustomEvent<void>) => void;
        "onPushBreadcrumb"?: (event: CustomEvent<[string, string]>) => void;
    }
    interface IntrinsicElements {
        "breadcrumb-provider": BreadcrumbProvider;
        "content-create": ContentCreate;
        "content-delete": ContentDelete;
        "content-edit": ContentEdit;
        "content-list": ContentList;
        "gel-breadcrumbs": GelBreadcrumbs;
        "gel-form": GelForm;
        "gel-input-rich": GelInputRich;
        "gel-input-select": GelInputSelect;
        "gel-input-switch": GelInputSwitch;
        "gel-input-text": GelInputText;
        "gel-menu": GelMenu;
        "gel-table": GelTable;
        "graphene-nav": GrapheneNav;
        "graphene-provider": GrapheneProvider;
        "graphene-ui": GrapheneUi;
        "notification-provider": NotificationProvider;
        "util-guard": UtilGuard;
        "util-route-listener": UtilRouteListener;
        "view-content": ViewContent;
        "view-dashboard": ViewDashboard;
        "view-login": ViewLogin;
        "view-logout": ViewLogout;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "breadcrumb-provider": LocalJSX.BreadcrumbProvider & JSXBase.HTMLAttributes<HTMLBreadcrumbProviderElement>;
            "content-create": LocalJSX.ContentCreate & JSXBase.HTMLAttributes<HTMLContentCreateElement>;
            "content-delete": LocalJSX.ContentDelete & JSXBase.HTMLAttributes<HTMLContentDeleteElement>;
            "content-edit": LocalJSX.ContentEdit & JSXBase.HTMLAttributes<HTMLContentEditElement>;
            "content-list": LocalJSX.ContentList & JSXBase.HTMLAttributes<HTMLContentListElement>;
            "gel-breadcrumbs": LocalJSX.GelBreadcrumbs & JSXBase.HTMLAttributes<HTMLGelBreadcrumbsElement>;
            "gel-form": LocalJSX.GelForm & JSXBase.HTMLAttributes<HTMLGelFormElement>;
            "gel-input-rich": LocalJSX.GelInputRich & JSXBase.HTMLAttributes<HTMLGelInputRichElement>;
            "gel-input-select": LocalJSX.GelInputSelect & JSXBase.HTMLAttributes<HTMLGelInputSelectElement>;
            "gel-input-switch": LocalJSX.GelInputSwitch & JSXBase.HTMLAttributes<HTMLGelInputSwitchElement>;
            "gel-input-text": LocalJSX.GelInputText & JSXBase.HTMLAttributes<HTMLGelInputTextElement>;
            "gel-menu": LocalJSX.GelMenu & JSXBase.HTMLAttributes<HTMLGelMenuElement>;
            "gel-table": LocalJSX.GelTable & JSXBase.HTMLAttributes<HTMLGelTableElement>;
            "graphene-nav": LocalJSX.GrapheneNav & JSXBase.HTMLAttributes<HTMLGrapheneNavElement>;
            "graphene-provider": LocalJSX.GrapheneProvider & JSXBase.HTMLAttributes<HTMLGrapheneProviderElement>;
            "graphene-ui": LocalJSX.GrapheneUi & JSXBase.HTMLAttributes<HTMLGrapheneUiElement>;
            "notification-provider": LocalJSX.NotificationProvider & JSXBase.HTMLAttributes<HTMLNotificationProviderElement>;
            "util-guard": LocalJSX.UtilGuard & JSXBase.HTMLAttributes<HTMLUtilGuardElement>;
            "util-route-listener": LocalJSX.UtilRouteListener & JSXBase.HTMLAttributes<HTMLUtilRouteListenerElement>;
            "view-content": LocalJSX.ViewContent & JSXBase.HTMLAttributes<HTMLViewContentElement>;
            "view-dashboard": LocalJSX.ViewDashboard & JSXBase.HTMLAttributes<HTMLViewDashboardElement>;
            "view-login": LocalJSX.ViewLogin & JSXBase.HTMLAttributes<HTMLViewLoginElement>;
            "view-logout": LocalJSX.ViewLogout & JSXBase.HTMLAttributes<HTMLViewLogoutElement>;
        }
    }
}

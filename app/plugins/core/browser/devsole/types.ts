export type DevsoleSectionId =
  | "console"
  | "network"
  | "elements"
  | "resources"
  | "info"
  | "proxies";

export type DevsoleConsoleLevel =
  | "log"
  | "info"
  | "warn"
  | "error"
  | "debug";

export interface DevsoleConsoleValue {
  type:
    | "string"
    | "number"
    | "boolean"
    | "null"
    | "undefined"
    | "bigint"
    | "symbol"
    | "function"
    | "date"
    | "error"
    | "array"
    | "object"
    | "unknown";
  preview: string;
}

export interface DevsoleConsoleEntry {
  id: string;
  level: DevsoleConsoleLevel;
  source: "console" | "error" | "promise";
  timestamp: number;
  values: DevsoleConsoleValue[];
  stack?: string | null;
}

export interface DevsoleNetworkEntry {
  id: string;
  url: string;
  method: string;
  status: number | null;
  ok: boolean | null;
  type: string;
  startedAt: number;
  durationMs: number | null;
  requestBody?: string | null;
  responsePreview?: string | null;
  responseBody?: string | null;
  error?: string | null;
}

export interface DevsoleElementsBreadcrumb {
  path: string;
  label: string;
}

export interface DevsoleElementsAttribute {
  name: string;
  value: string;
}

export interface DevsoleElementsStyleProperty {
  name: string;
  value: string;
  source?: string;
}

export interface DevsoleElementsChildNode {
  path: string;
  label: string;
  nodeType: "element" | "text" | "comment" | "doctype" | "other";
  childCount: number;
  hasChildren: boolean;
  textPreview?: string | null;
}

export interface DevsoleElementsSnapshot {
  path: string;
  label: string;
  nodeType: "element" | "text" | "comment" | "doctype" | "other";
  tagName?: string | null;
  selectorPath?: string | null;
  attributes: DevsoleElementsAttribute[];
  inlineStyle?: string | null;
  inlineStyleProperties?: DevsoleElementsStyleProperty[];
  directTextContent?: string | null;
  sourceContent?: string | null;
  declaredStyles?: DevsoleElementsStyleProperty[];
  childCount: number;
  textPreview?: string | null;
  breadcrumbs: DevsoleElementsBreadcrumb[];
  children: DevsoleElementsChildNode[];
}

export interface DevsoleResourceStorageItem {
  id: string;
  area: "localStorage" | "sessionStorage";
  key: string;
  value: string;
}

export interface DevsoleResourceCookieItem {
  id: string;
  name: string;
  value: string;
}

export interface DevsoleResourcesSnapshot {
  url: string;
  title: string;
  userAgent: string;
  localStorage: DevsoleResourceStorageItem[];
  sessionStorage: DevsoleResourceStorageItem[];
  cookies: DevsoleResourceCookieItem[];
}

export interface DevsoleInfoField {
  section: string;
  label: string;
  value: string;
}

export interface DevsoleInfoSnapshot {
  fields: DevsoleInfoField[];
}

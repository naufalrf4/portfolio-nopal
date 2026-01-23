export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export interface PageViewEvent {
  page_title: string;
  page_location: string;
  page_path: string;
}

export interface CustomEvent {
  event_category: string;
  event_label?: string;
  value?: number;
}

export type GtagFunction = (...args: unknown[]) => void;

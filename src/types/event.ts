export type EventStatus = 'draft' | 'published' | 'cancelled';
export type EventTiming = 'upcoming' | 'past';

export interface EventImage {
  url: string;
  thumbnail_url: string | null;
  caption: string | null;
  sort_order: number;
}

export interface AdminEventImage extends EventImage {
  id: number;
}

export interface EventListItem {
  slug: string;
  title: string;
  description: string;
  event_date: string;
  end_date: string | null;
  location: string;
  organizer: string | null;
  cover_image_url: string | null;
  cover_image_thumbnail_url: string | null;
  status: EventStatus;
  timing: EventTiming;
  is_upcoming: boolean;
  show_on_homepage: boolean;
  created_at: string;
}

export interface AdminEventListItem extends EventListItem {
  id: number;
  updated_at: string;
}

export interface EventDetail extends EventListItem {
  images: EventImage[];
}

export interface AdminEventDetail extends AdminEventListItem {
  images: AdminEventImage[];
}

export interface EventFilters {
  q?: string;
  status?: EventStatus;
  type?: EventTiming;
  homepage?: boolean;
  sort?: 'date_asc' | 'date_desc' | 'created_desc';
  per_page?: number;
  page?: number;
}

export interface SaveEventFormValues {
  title: string;
  description: string;
  event_date: string;
  end_date?: string;
  location: string;
  organizer?: string;
  status: EventStatus;
  show_on_homepage: boolean;
  cover_image?: File | null;
  remove_cover?: boolean;
}

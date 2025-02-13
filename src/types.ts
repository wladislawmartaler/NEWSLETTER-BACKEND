export type Subscriber = {
  id?: number | null;
  name: string;
  last_name: string;
  email: string;
  phone: string;
};

export type Newsletter = {
  id?: number | null;
  created_at: string;
  updated_at: string | null;
  author: string;
  category: string;
  content: string;
};

export type SubscriberNewsletter = {
  id: number;
  newsletter: number;
  subscriber: number;
};

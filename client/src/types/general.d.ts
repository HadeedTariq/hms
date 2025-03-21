type User = {
  id: number;
  username: string;
  email: string;
  avatar: string;
  role: string;
};

type ErrResponse = {
  response: {
    data: {
      message: string;
    };
  };
};
interface Hotel {
  id: number;
  name: string;
  description?: string | null;
  location: string;
  rating?: number | null; // DECIMAL(2, 1) allows for null values
  contact_email: string;
  contact_phone: string;
  owner_id?: number | null;
  created_at: Date;
  updated_at: Date;
  hotel_images?: string[];
  amenities?: string[];
  policies?: string | null;
  check_in_time?: string; // TIME type in Postgres is often represented as string in JS
  check_out_time?: string; // TIME type in Postgres is often represented as string in JS
}

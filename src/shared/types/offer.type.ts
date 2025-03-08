import { User } from './user.type.js';
import { City } from './city.type.js';
import { AccommodationCategory } from './accommodation-category.enum.js';
import { Amenity } from './amenity.enum.js';
import { LngLat } from './lng-lat.type.js';

export type Offer = {
  title: string;
  description: string;
  preview: string;
  photos: string[];

  author: User;
  postDate: Date;

  city: City;
  lngLat: LngLat;

  accommodationCategory: AccommodationCategory;
  amenities: Amenity[];

  rentalPrice: number;
  roomsQuantity: number;
  guestsQuantity: number;
  commentsCount: number;
  rating: number;

  isPremium: boolean;
  isFavorite: boolean;
}

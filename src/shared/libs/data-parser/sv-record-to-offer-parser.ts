import {
  Offer,
  User,
  UserType,
  City,
  AccommodationCategory,
  Amenity,
  LngLat,
  SVRecord,
  SVValuePartsSeparator
} from '../../types/index.js';
import { DataParser } from './data-parser.interface.js';

const TRUE_STRING = String(true);

export class SVRecordToOfferParser implements DataParser<SVRecord, Offer> {
  constructor(
    private readonly valuePartsSeparator: SVValuePartsSeparator = SVValuePartsSeparator.Semicolon
  ) {}

  public parse(record: SVRecord): Offer {
    const [
      title,
      description,
      preview,
      photos,

      author,
      postDate,

      city,
      lngLat,

      accommodationCategory,
      amenities,

      rentalPrice,
      roomsQuantity,
      guestsQuantity,
      commentsCount,
      rating,

      isPremium,
      isFavorite
    ] = record;

    return {
      title,
      description,
      preview,
      photos: this.parsePhotos(photos),

      author: this.parseUser(author),
      postDate: this.parseDate(postDate),

      city: this.parseCity(city),
      lngLat: this.parseLngLat(lngLat),

      accommodationCategory: accommodationCategory as AccommodationCategory,
      amenities: this.parseAmenities(amenities),

      rentalPrice: this.parseInt(rentalPrice),
      roomsQuantity: this.parseInt(roomsQuantity),
      guestsQuantity: this.parseInt(guestsQuantity),
      commentsCount: this.parseInt(commentsCount),
      rating: this.parseFloat(rating),

      isPremium: this.parseBoolean(isPremium),
      isFavorite: this.parseBoolean(isFavorite)
    };
  }

  private parsePhotos(value: string): string[] {
    return value.split(this.valuePartsSeparator);
  }

  private parseUser(value: string): User {
    const [
      type,
      name,
      email,
      password,
      avatar
    ] = value.split(this.valuePartsSeparator);

    return {
      type: type as UserType,
      name,
      email,
      password,
      avatar
    };
  }

  private parseDate(value: string): Date {
    return new Date(value);
  }

  private parseCity(value: string): City {
    const [name, lng, lat] = value.split(this.valuePartsSeparator);

    return {
      name,
      lngLat: this.parseLngLat(`${lng}${this.valuePartsSeparator}${lat}`)
    };
  }

  private parseLngLat(value: string): LngLat {
    const [lng, lat] = value.split(this.valuePartsSeparator).map(this.parseFloat);
    return { lng, lat };
  }

  private parseAmenities(value: string): Amenity[] {
    return value.split(this.valuePartsSeparator) as Amenity[];
  }

  private parseInt(value: string): number {
    return parseInt(value, 10);
  }

  private parseFloat(value: string): number {
    return parseFloat(value);
  }

  private parseBoolean(value: string): boolean {
    return value === TRUE_STRING;
  }
}

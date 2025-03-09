import {
  Offer,
  User,
  UserType,
  City,
  AccommodationCategory,
  Amenity,
  LngLat,
  SVRecord
} from '../../types/index.js';
import { DataParser } from './data-parser.interface.js';

const SOURCE_VALUE_SEPARATOR = ',';
const TRUE_STRING = String(true);

export class SVToOffersParser implements DataParser<SVRecord[], Offer[]> {
  public parse(sourceData: SVRecord[]): Offer[] {
    return sourceData.map((sourceRecord) => this.parseRecord(sourceRecord));
  }

  private parseRecord(sourceRecord: SVRecord): Offer {
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
    ] = sourceRecord;

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

      rentalPrice: this.parseFloat(rentalPrice),
      roomsQuantity: this.parseInt(roomsQuantity),
      guestsQuantity: this.parseInt(guestsQuantity),
      commentsCount: this.parseInt(commentsCount),
      rating: this.parseFloat(rating),

      isPremium: this.parseBoolean(isPremium),
      isFavorite: this.parseBoolean(isFavorite)
    };
  }

  private parsePhotos(sourceValue: string): string[] {
    return sourceValue.split(SOURCE_VALUE_SEPARATOR);
  }

  private parseUser(sourceValue: string): User {
    const [
      type,
      name,
      email,
      password,
      avatar
    ] = sourceValue.split(SOURCE_VALUE_SEPARATOR);

    return {
      type: type as UserType,
      name,
      email,
      password,
      avatar
    };
  }

  private parseDate(sourceValue: string): Date {
    return new Date(sourceValue);
  }

  private parseCity(sourceValue: string): City {
    const [name, lng, lat] = sourceValue.split(SOURCE_VALUE_SEPARATOR);

    return {
      name,
      lngLat: this.parseLngLat(`${lng}${SOURCE_VALUE_SEPARATOR}${lat}`)
    };
  }

  private parseLngLat(sourceValue: string): LngLat {
    const [lng, lat] = sourceValue.split(SOURCE_VALUE_SEPARATOR).map(this.parseFloat);
    return { lng, lat };
  }

  private parseAmenities(sourceValue: string): Amenity[] {
    return sourceValue.split(SOURCE_VALUE_SEPARATOR) as Amenity[];
  }

  private parseInt(sourceValue: string): number {
    return parseInt(sourceValue, 10);
  }

  private parseFloat(sourceValue: string): number {
    return parseFloat(sourceValue);
  }

  private parseBoolean(sourceValue: string): boolean {
    return sourceValue === TRUE_STRING;
  }
}

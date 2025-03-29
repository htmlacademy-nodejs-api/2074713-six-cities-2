import dayjs from 'dayjs';

import {
  UserType,
  AccommodationCategory,
  Amenity,
  OffersSourceData,
  SVRecord,
  SVValuePartsSeparator
} from '../../types/index.js';
import { Random } from '../random/index.js';
import { DataGenerator } from './data-generator.interface.js';

const PHOTOS_QUANTITY = 6;

const USER_TYPES = Object.values(UserType);
const MIN_OFFER_AGE_IN_DAYS = 1;
const MAX_OFFER_AGE_IN_DAYS = 10;

const MIN_LNG = -180;
const MAX_LNG = 180;
const MIN_LAT = -90;
const MAX_LAT = 90;
const LNG_LAT_FRACTION_PRECISION = 6;

const ACCOMMODATION_CATEGORIES = Object.values(AccommodationCategory);
const AMENITIES = Object.values(Amenity);
const AMENITIES_MIN_QUANTITY = 1;

const MIN_RENTAL_PRICE = 100;
const MAX_RENTAL_PRICE = 100000;
const MIN_ROOMS_QUANTITY = 1;
const MAX_ROOMS_QUANTITY = 8;
const MIN_GUESTS_QUANTITY = 1;
const MAX_GUESTS_QUANTITY = 10;
const MIN_COMMENTS_COUNT = 0;
const MAX_COMMENTS_COUNT = 100;
const MIN_RATING = 1;
const MAX_RATING = 5;
const RATING_FRACTION_PRECISION = 1;

export class OfferSVRecordGenerator implements DataGenerator<OffersSourceData, SVRecord> {
  private sourceData: null | OffersSourceData = null;

  constructor(
    private readonly valuePartsSeparator: SVValuePartsSeparator = SVValuePartsSeparator.Semicolon
  ) {}

  public setSourceData(sourceData: OffersSourceData): void {
    this.sourceData = sourceData;
  }

  public generate(): SVRecord | never {
    if (!this.sourceData) {
      throw new Error(
        'Для генерации записи объявления требуются исходные наборы возможных значений'
      );
    }

    return [
      this.generateTitle(),
      this.generateDescription(),
      this.generatePreview(),
      this.generatePhotos(),

      this.generateUser(),
      this.generateDate(),

      this.generateCity(),
      this.generateLngLat(),

      this.generateAccommodationCategory(),
      this.generateAmenities(),

      this.generateRentalPrice(),
      this.generateRoomsQuantity(),
      this.generateGuestsQuantity(),
      this.generateCommentsCount(),
      this.generateRating(),

      this.generateIsPremium(),
      this.generateIsFavorite()
    ];
  }

  private generateTitle(): string {
    return Random.getItem(this.sourceData!.offersValues.titles);
  }

  private generateDescription(): string {
    return Random.getItem(this.sourceData!.offersValues.descriptions);
  }

  private generatePreview(): string {
    return Random.getItem(this.sourceData!.offersValues.photos);
  }

  private generatePhotos(): string {
    return Random.getUniqueItems(
      this.sourceData!.offersValues.photos,
      { quantity: PHOTOS_QUANTITY }
    ).join(this.valuePartsSeparator);
  }

  private generateUser(): string {
    const sourceData = this.sourceData!;

    return [
      Random.getItem(USER_TYPES),
      Random.getItem(sourceData.usersValues.names),
      Random.getItem(sourceData.usersValues.emails),
      Random.getItem(sourceData.usersValues.passwords),
      Random.getItem(sourceData.usersValues.avatars)
    ].join(this.valuePartsSeparator);
  }

  private generateDate(): string {
    return dayjs()
      .startOf('day')
      .subtract(Random.getNumberFromRange(MIN_OFFER_AGE_IN_DAYS, MAX_OFFER_AGE_IN_DAYS), 'days')
      .toISOString();
  }

  private generateCity(): string {
    const city = Random.getItem(this.sourceData!.offersValues.cities);
    return [city.name, city.lngLat.lng, city.lngLat.lat].join(this.valuePartsSeparator);
  }

  private generateLngLat(): string {
    return [
      Random.getNumberFromRange(MIN_LNG, MAX_LNG, LNG_LAT_FRACTION_PRECISION),
      Random.getNumberFromRange(MIN_LAT, MAX_LAT, LNG_LAT_FRACTION_PRECISION)
    ].join(this.valuePartsSeparator);
  }

  private generateAccommodationCategory(): string {
    return Random.getItem(ACCOMMODATION_CATEGORIES);
  }

  private generateAmenities(): string {
    return Random.getUniqueItems(
      AMENITIES,
      { minQuantity: AMENITIES_MIN_QUANTITY }
    ).join(this.valuePartsSeparator);
  }

  private generateRentalPrice(): string {
    return `${Random.getNumberFromRange(MIN_RENTAL_PRICE, MAX_RENTAL_PRICE)}`;
  }

  private generateRoomsQuantity(): string {
    return `${Random.getNumberFromRange(MIN_ROOMS_QUANTITY, MAX_ROOMS_QUANTITY)}`;
  }

  private generateGuestsQuantity(): string {
    return `${Random.getNumberFromRange(MIN_GUESTS_QUANTITY, MAX_GUESTS_QUANTITY)}`;
  }

  private generateCommentsCount(): string {
    return `${Random.getNumberFromRange(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT)}`;
  }

  private generateRating(): string {
    return `${Random.getNumberFromRange(MIN_RATING, MAX_RATING, RATING_FRACTION_PRECISION)}`;
  }

  private generateIsPremium(): string {
    return `${Random.getBoolean()}`;
  }

  private generateIsFavorite(): string {
    return `${Random.getBoolean()}`;
  }
}

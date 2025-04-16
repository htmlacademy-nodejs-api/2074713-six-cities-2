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
const OfferAgeInDays = { Min: 1, Max: 10 };

const CoordinatesConstraint = {
  MinLng: -180,
  MaxLng: 180,
  MinLat: -90,
  MaxLat: 90
};
const LNG_LAT_FRACTION_PRECISION = 6;

const ACCOMMODATION_CATEGORIES = Object.values(AccommodationCategory);
const AMENITIES = Object.values(Amenity);
const AMENITIES_MIN_QUANTITY = 1;

const RentalPrice = { Min: 100, Max: 100000 };
const RoomsQuantity = { Min: 1, Max: 8 };
const GuestsQuantity = { Min: 1, Max: 10 };
const CommentsCount = { Min: 0, Max: 100 };
const Rating = { Min: 1, Max: 5 };
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
      .subtract(Random.getNumberFromRange(OfferAgeInDays.Min, OfferAgeInDays.Max), 'days')
      .toISOString();
  }

  private generateCity(): string {
    const city = Random.getItem(this.sourceData!.offersValues.cities);
    return [city.name, city.lngLat.lng, city.lngLat.lat].join(this.valuePartsSeparator);
  }

  private generateLngLat(): string {
    return [
      Random.getNumberFromRange(
        CoordinatesConstraint.MinLng,
        CoordinatesConstraint.MaxLng,
        LNG_LAT_FRACTION_PRECISION
      ),
      Random.getNumberFromRange(
        CoordinatesConstraint.MinLat,
        CoordinatesConstraint.MaxLat,
        LNG_LAT_FRACTION_PRECISION
      )
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
    return `${Random.getNumberFromRange(RentalPrice.Min, RentalPrice.Max)}`;
  }

  private generateRoomsQuantity(): string {
    return `${Random.getNumberFromRange(RoomsQuantity.Min, RoomsQuantity.Max)}`;
  }

  private generateGuestsQuantity(): string {
    return `${Random.getNumberFromRange(GuestsQuantity.Min, GuestsQuantity.Max)}`;
  }

  private generateCommentsCount(): string {
    return `${Random.getNumberFromRange(CommentsCount.Min, CommentsCount.Max)}`;
  }

  private generateRating(): string {
    return `${Random.getNumberFromRange(Rating.Min, Rating.Max, RATING_FRACTION_PRECISION)}`;
  }

  private generateIsPremium(): string {
    return `${Random.getBoolean()}`;
  }

  private generateIsFavorite(): string {
    return `${Random.getBoolean()}`;
  }
}

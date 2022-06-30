export interface Location {
  referencePosition: ReferencePosition;
  roadAccessPosition: ReferencePosition;
  address: Address;
  formattedAddress: string;
  locationType: string;
  quality: Quality;
}

interface Quality {
  totalScore: number;
}

interface Address {
  countryName: string;
  state: string;
  province: string;
  postalCode: string;
  city: string;
  district: string;
  subdistrict: string;
  street: string;
  houseNumber: string;
}

interface ReferencePosition {
  latitude: number;
  longitude: number;
}

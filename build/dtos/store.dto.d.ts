declare class AddressDTO {
    country: string;
    state: string;
    city: string;
    postalCode: string;
}
export declare class CreateStoreDTO {
    userID: string;
    storeName: string;
    ownerName: string;
    email: string;
    phoneNumber: string;
    passportPhoto: string;
    businessRegistrationNumber: string;
    storeAddress: AddressDTO;
    ownerGovernmentID: string;
    businessRegistrationCertificate: string;
    storefrontImage?: string;
}
export declare class UpdateStoreDTO extends CreateStoreDTO {
}
export {};

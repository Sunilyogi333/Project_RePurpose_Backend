export enum Environment {
  DEVELOPMENT = 'DEVELOPMENT',
  PRODUCTION = 'PRODUCTION',
}

export enum ROLE {
  ADMIN = 'admin',
  MEMBER = 'member',
  SELLER = 'seller',
  STORE = 'store'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHERS = 'OTHERS',
}

export enum SELLER_KYC_STATUS {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum PACKAGE_STATUS {
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  CANCELLED = 'CANCELLED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum PRODUCT_STATUS {
  AVAILABLE = 'AVAILABLE',
  ORDERED = 'ORDERED',
  SOLD = 'SOLD',
  DONATED = 'DONATED',
}

export enum NOTIFICATION_TYPE {
  PROMOTIONAL = 'Promotional',
  SYSTEM_ALERT = 'System Alert',
  PRODUCT_UPDATE = 'Product Update',
  ORDER_STATUS = 'Order Status',
}


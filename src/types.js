// @flow

export type Auth = {
  token: string,
  workspaceId: string,
  nodeId: string
};

export type Query = {
  name: string,
  query: Object
};

export type GetCustomersOptions = {|
  externalId?: string,
  query?: Query,
  fields?: Array<string>,
  sort?: string,
  direction?: 'asc' | 'desc'
|};

export type Tags = {
  auto: Array<string>,
  manual: Array<string>
};

export type OtherContact = {
  name?: string,
  type?: 'MOBILE' | 'PHONE' | 'EMAIL' | 'FAX' | 'OTHER',
  value?: string
};

export type MobileDevice = {
  identifier?: string,
  name?: string,
  type?: 'IOS' | 'GCM' | 'WP'
};

export type Contacts = {
  email?: string,
  fax?: string,
  mobilePhone?: string,
  phone?: string,
  otherContacts?: Array<OtherContact>,
  mobileDevices?: Array<MobileDevice>
};

export type Geo = {
  lat: number,
  lon: number
};

export type Address = {
  street?: string,
  city?: string,
  country?: string,
  province?: string,
  zip?: string,
  geo?: Geo
};

export type Credential = {
  username?: string,
  password?: string
};

export type Education = {
  id: string,
  schoolType?: 'PRIMARY_SCHOOL' | 'SECONDARY_SCHOOL' | 'HIGH_SCHOOL' | 'COLLEGE' | 'OTHER',
  schoolName?: string,
  schoolConcentration?: string,
  startYear?: number,
  endYear?: number,
  isCurrent?: boolean
};

export type Job = {
  id: string,
  companyIndustry?: string,
  companyName?: string,
  jobTitle?: string,
  startDate?: string,
  endDate?: string,
  isCurrent?: boolean
};

export type Like = {
  id: string,
  category?: string,
  name?: string
};

export type Social = {
  facebook?: string,
  google?: string,
  instagram?: string,
  linkedin?: string,
  qzone?: string,
  twitter?: string
};

export type Preference = {
  key: string,
  value: string
};

export type Subscription = {
  id: string,
  name?: string,
  type?: string,
  kind?: 'DIGITAL_MESSAGE' | 'SERVICE' | 'OTHER',
  subscribed?: boolean,
  startDate?: string,
  endDate?: string,
  subscriberId?: string,
  registeredAt?: string,
  updatedAt?: string,
  preferences?: Array<Preference>
};

export type BaseProperties = {
  pictureUrl?: string,
  title?: string,
  prefix?: string,
  firstName?: string,
  lastName?: string,
  middleName?: string,
  gender?: string,
  dob?: string,
  locale?: string,
  timezone?: string,
  contacts?: Contacts,
  address?: Address,
  credential?: Credential,
  educations?: Array<Education>,
  likes?: Array<Like>,
  socialProfile?: Social,
  jobs?: Array<Job>,
  subscriptions?: Array<Subscription>
};

export type CustomerData = {
  externalId?: string,
  base?: BaseProperties,
  extended?: Object,
  extra?: string,
  tags?: Tags
};

export type Customer = CustomerData & {
  id: string,
  registeredAt: Date,
  updatedAt: Date
};

export type APICustomer = {
  id: string,
  nodeId: string,
  externalId: string | null,
  extra: string | null,
  registeredAt: string,
  updatedAt: string,
  enabled: boolean,
  base: BaseProperties | null,
  extended: Object | null,
  tags: Tags | null
};

export type EventData = {
  customerId?: string,
  externalId?: string,
  sessionId?: string,
  type: string,
  context: string,
  properties: Object,
  contextInfo?: Object,
  date?: Date
};

export type Event = EventData & {
  id: string,
  registeredAt: Date
};

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
  direction?: 'asc' | 'desc',
  page?: number
|};

// SDK Customer

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
  startDate?: Date,
  endDate?: Date,
  isCurrent?: boolean
};

export type Like = {
  id: string,
  category?: string,
  name?: string,
  createdTime?: Date
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
  startDate?: Date,
  endDate?: Date,
  subscriberId?: string,
  registeredAt?: Date,
  updatedAt?: Date,
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
  dob?: Date,
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

type EventType = 'abandonedCart' | 'addedCompare' | 'addedProduct' | 'addedWishlist' | 'campaignBlacklisted' | 'campaignBounced' | 'campaignLinkClicked' | 'campaignMarkedSpam' | 'campaignOpened' | 'campaignSent' | 'campaignSubscribed' | 'campaignUnsubscribed' | 'changedSetting' | 'clickedLink' | 'closedTicket' | 'completedOrder' | 'eventInvited' | 'eventParticipated' | 'formCompiled' | 'genericActiveEvent' | 'genericPassiveEvent' | 'loggedIn' | 'loggedOut' | 'openedTicket' | 'orderShipped' | 'removedCompare' | 'removedProduct' | 'removedWishlist' | 'repliedTicket' | 'reviewedProduct' | 'searched' | 'serviceSubscribed' | 'serviceUnsubscribed' | 'viewedPage' | 'viewedProduct' | 'viewedProductCategory'; // eslint-disable-line max-len
type EventContext = 'CONTACT_CENTER' | 'DIGITAL_CAMPAIGN' | 'ECOMMERCE' | 'IOT' | 'MOBILE' | 'OTHER' | 'RETAIL' | 'SOCIAL' | 'WEB'; // eslint-disable-line max-len

export type EventData = {
  customerId?: string,
  externalId?: string,
  sessionId?: string,
  type: EventType,
  context: EventContext,
  properties: Object,
  contextInfo?: Object,
  date?: Date
};

export type Event = EventData & {
  id: string,
  registeredAt: Date
};

// API Customer

export type APIMobileDevice = {
  identifier: ?string,
  name: ?string,
  type: null | 'IOS' | 'GCM' | 'WP'
};

export type APIContacts = {
  email: ?string,
  fax: ?string,
  mobilePhone: ?string,
  phone: ?string,
  otherContacts: Array<OtherContact>,
  mobileDevices: Array<APIMobileDevice>
};

export type APIAddress = {
  street: ?string,
  city: ?string,
  country: ?string,
  province: ?string,
  zip: ?string,
  geo: ?Geo
};

export type APICredential = {
  username: string,
  password: string
};

export type APIEducation = {
  id: string,
  schoolType: null | 'PRIMARY_SCHOOL' | 'SECONDARY_SCHOOL' | 'HIGH_SCHOOL' | 'COLLEGE' | 'OTHER',
  schoolName: ?string,
  schoolConcentration: ?string,
  startYear: ?number,
  endYear: ?number,
  isCurrent: ?boolean
};

export type APILike = {
  id: string,
  category: ?string,
  name: ?string,
  createdTime: string
};

export type APISocial = {
  facebook: ?string,
  google: ?string,
  instagram: ?string,
  linkedin: ?string,
  qzone: ?string,
  twitter: ?string
};

export type APIJob = {
  id: string,
  companyIndustry: ?string,
  companyName: ?string,
  jobTitle: ?string,
  startDate: ?string,
  endDate: ?string,
  isCurrent: ?boolean
};

export type APISubscription = {
  id: string,
  name: ?string,
  type: ?string,
  kind: null | 'DIGITAL_MESSAGE' | 'SERVICE' | 'OTHER',
  subscribed: ?boolean,
  startDate: ?string,
  endDate: ?string,
  subscriberId: ?string,
  registeredAt: ?string,
  updatedAt: ?string,
  preferences: Array<Preference>
};

export type APIBaseProperties = {
  pictureUrl: ?string,
  title: ?string,
  prefix: ?string,
  firstName: ?string,
  lastName: ?string,
  middleName: ?string,
  gender: ?string,
  dob: ?string,
  locale: ?string,
  timezone: ?string,
  contacts: ?APIContacts,
  address: ?APIAddress,
  credential: ?APICredential,
  educations: Array<APIEducation>,
  likes: Array<APILike>,
  socialProfile: APISocial,
  jobs: Array<APIJob>,
  subscriptions: Array<APISubscription>
};

export type APICustomerData = {
  externalId: ?string,
  extra: ?string,
  base: ?APIBaseProperties,
  extended: ?Object,
  tags: ?Tags
};

export type APICustomer = APICustomerData & {
  id: string,
  nodeId: string,
  enabled: boolean,
  registeredAt: string,
  updatedAt: string
};

export type EventFilters = {
  type?: EventType,
  context?: EventContext,
  mode?: 'ACTIVE' | 'PASSIVE',
  dateFrom?: Date,
  dateTo?: Date,
  page?: number
};

export type Paginated<T> = {
  page: {
    current: number,
    total: number,
    prev: () => ?Promise<Paginated<T>>,
    next: () => ?Promise<Paginated<T>>
  },
  elements: Array<T>
};

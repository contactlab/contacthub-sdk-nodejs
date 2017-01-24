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

export type Job = {
  id: string,
  companyIndustry?: string,
  companyName?: string,
  jobTitle?: string,
  startDate: string,
  endDate: string,
  isCurrent: boolean
};

export type CustomerOps = {
  updateCustomer: Function,
  deleteCustomer: Function,
  addJob: Function,
  updateJob: Function
};

export type CustomerTags = {
  auto?: Array<string>,
  manual?: Array<string>
};

export type CustomerContacts = {
  email?: string,
  fax?: string,
  mobilePhone?: string,
  phone?: string,
  otherContacts?: string,
  mobileDevices?: string
};

export type CustomerGeo = {
  lat: string,
  lon: string
};

export type CustomerAddress = {
  street?: string,
  city?: string,
  country?: string,
  province?: string,
  zip?: string,
  geo?: CustomerGeo
};

export type CustomerCredential = {
  username?: string,
  password?: string
};

export type CustomerLike = {
  likeId: string,
  likeCategory: string,
  likeName: string
};

export type CustomerSocial = {
  facebook?: string,
  google?: string,
  instagram?: string,
  linkedin?: string,
  qzone?: string,
  twitter?: string
};

export type CustomerJob = {
  id: string,
  companyIndustry?: string,
  companyName?: string,
  jobTitle?: string,
  startDate: string,
  endDate: string,
  isCurrent: bool
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
  contacts?: CustomerContacts,
  address?: CustomerAddress,
  credential?: CustomerCredential,
  educations?: string,
  likes?: Array<CustomerLike>,
  socialProfile?: CustomerSocial,
  jobs?: Array<CustomerJob>,
  subscriptions?: string
};

export type CustomerData = {
  externalId?: string,
  base: BaseProperties,
  extended?: Object,
  extra?: string,
  tags: CustomerTags
};

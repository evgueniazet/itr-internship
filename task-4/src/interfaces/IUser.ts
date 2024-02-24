interface ITimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  registrationDate: ITimestamp;
  lastLoginDate: ITimestamp;
  status: string;
}

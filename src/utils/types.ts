export type CreateUserParams = {
  username: string;
  password: string;
};

export type CreateHospitalParams = {
  hid: string;
  baseName: string;
  shortName: string;
}

export type UpdateUserParams = {
  id: number;
  username?: string;
  password?: string;
  isPro?: boolean;
};

export type CreateUserProfileParams = {
  firstName: string;
  lastName: string;
  age: number;
  dob: string;
};

export type CreateUserPostParams = {
  title: string;
  description: string;
};

export type CreateUserParams = {
  username: string;
  password: string;
};

export type CreateHospitalParams = {
  hid: string;
  baseName: string;
  shortName: string;
}

export type CreateReviewParams = {
  review_id: number;
  user_id: string;
  doctor_id: number;
  content: string;
  nickname: string;
  total_score: number;
  kindness_score: number;
  explaination_score: number;
  satisfaction_score: number;
  recommand_score: number;
  createAt: Date;
  updateAt: Date;
}

export type UpdateReviewParams = {
  review_id: any;
  user_id: string;
  doctor_id: string;
  content: string;
  nickname: string;
  total_score: number;
  kindness_score: number;
  explaination_score: number;
  satisfaction_score: number;
  recommand_score: number;
  }

export type CreateDoctorParams = {
  rid: string;
  hid: string;
  data_version_id: string;
  depthname: string;
  doctrname: string;
  doctor_url: string;
  doctor_id: string;
  prev_id: string;
  short_id: string;
  specialties: string;
  profileimgurl: string;
  local_img: string;
  standard_opt: string;
  standard_spec: string;
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

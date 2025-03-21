import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';
import { Hospital } from 'src/typeorm/entities/Hospital';
import { CreateUserPostDto } from 'src/users/dtos/CreateUserPost.dto';
import {
  CreateUserParams,
  CreateHospitalParams,
  CreateUserProfileParams,
  UpdateUserParams,
} from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(Hospital) private hospitalsRepository: Repository<Hospital>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  findHospitals() {
    return this.hospitalsRepository.find();
  }

  findUsers() {
    return this.userRepository.find({ relations: ['profile', 'posts'] });
  }

  createHospital(hospitalDetails: CreateHospitalParams) {
    const newHospital = this.hospitalsRepository.create({
      ...hospitalDetails
    });

    return this.hospitalsRepository.save(newHospital);
  }

  updateUser(updateUserDetails: UpdateUserParams) {
    return this.userRepository.update(
      { id: updateUserDetails.id },
      { ...updateUserDetails },
    );
  }

  getUser(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }

  // User Profile
  async createUserProfile(
    userId: number,
    createUserProfileDetails: CreateUserProfileParams,
  ) {
    const user = await this.getUser(userId);

    if (!user) {
      throw new HttpException(
        'User not found. Cannot create Profile',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newProfile = this.profileRepository.create(createUserProfileDetails);

    const savedProfile = await this.profileRepository.save(newProfile);

    user.profile = savedProfile;

    return this.userRepository.save(user);
  }

  // User Post
  async createUserPost(userId, createUserPostDetails: CreateUserPostDto) {
    const user = await this.getUser(userId);

    if (!user) {
      throw new HttpException(
        'User not found. Cannot create Post',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newPost = this.postRepository.create({
      ...createUserPostDetails,
      user,
    });

    return this.postRepository.save(newPost);
  }
}

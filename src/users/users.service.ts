import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}


  async findAllPaginated(options: IPaginationOptions): Promise<Pagination<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.orderBy('user.createdAt', 'DESC'); // Opcional
    return paginate<User>(queryBuilder, options);
  }

  async findByEmail(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async findById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
    return this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;
    return this.userRepository.remove(user);
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(options: FindUsersDto) {
    const { page = 1, limit = 10, isActive } = options;
    const take = Math.min(Number(limit) || 10, 100);
    const skip = (Number(page) - 1) * take;

    const where: any = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return this.userRepository.find({
      where,
      skip,
      take,
    });
  }

  async updateProfile(id: string, profile: string) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException('User not found');
    user.profile = profile;
    return this.userRepository.save(user);
  }

}
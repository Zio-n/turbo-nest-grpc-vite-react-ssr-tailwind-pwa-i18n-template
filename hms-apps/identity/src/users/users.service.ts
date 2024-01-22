import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
//import { CreateUserDto } from './dto/create-user.dto';
//import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, PaginationDto, UpdateUserDto, Users } from '@common/hms-lib';
// import { User as userCommon } from '@common/hms-lib';
import { randomUUID } from 'crypto';
import { Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class UsersService implements OnModuleInit{
  //static user data for demo purpose only
  // private readonly users:User[] = [];
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
      for (let i=0; i <= 100; i++){
        let createUserDto: CreateUserDto = {
          primaryEmailAddress: `piosystems${i}@yahoo.co.uk`,
          passwordHash: randomUUID(),
          firstName: `Pio${i}`,
          lastName: `Systems${i}`
        }
        this.create(createUserDto)
      }
  }
  // create(createUserDto: CreateUserDto): User {
  //   const user:User = { //these should be from entity
  //     ...createUserDto,
  //     id: randomUUID(),
  //     primaryEmailAddress: createUserDto.primaryEmailAddress,
  //     firstName: createUserDto.firstName,
  //     lastName: createUserDto.lastName,
  //     backupEmailAddress: '',
  //     phone: {},
  //     isPrimaryEmailAddressVerified: false,
  //     isBackupEmailAddressVerified: false,
  //     passwordHash: randomUUID()
  //   }
  //   this.users.push(user);
  //   return user;
  // }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      ...createUserDto,
      id: randomUUID(),
      backupEmailAddress: '',
      isPrimaryEmailAddressVerified: false,
      isBackupEmailAddressVerified: false,
      passwordHash: randomUUID(),

    });

    return await this.userRepository.save(user);
  }
  async findAll(): Promise<Users> {
    const users = await this.userRepository.find();
    return { users };
  }

  async findOne(id: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User not found by id ${id}`);
    }

    this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User not found by id ${id}`);
    }

    return await this.userRepository.remove(user);
  }

  queryUsers(paginationDtoStream: Observable<PaginationDto>): Observable<Users> {
    const subject = new Subject<Users>();

    paginationDtoStream.pipe(
      switchMap(async (paginationDto: PaginationDto) => {
        const start = paginationDto.page * paginationDto.skip;
        const users = await this.userRepository.find({
          skip: start,
          take: paginationDto.skip,
        });

        subject.next({ users });
      }),
    ).subscribe({
      error: (error) => subject.error(error),
      complete: () => subject.complete(),
    });

    return subject.asObservable();
  }

  async findOneUserByPrimaryEmailAddress(primaryEmailAddress: string): Promise<User | undefined> {
    return this.userRepository.findOne({  where: { primaryEmailAddress } });
  }


  // findAll(): Users {
  //   return {users: this.users};
  // }

  // findOne(id: string): User {
  //   return this.users.find((user) => user.id === id);
  // }

  // update(id: string, updateUserDto: UpdateUserDto): User {
  //   const userIndex = this.users.findIndex((user) => user.id === id);
  //   if (userIndex !== -1){
  //     this.users[userIndex] = {
  //       ...this.users[userIndex],
  //       ...updateUserDto
  //     }
  //     return this.users[userIndex]
  //   }
  //   throw new NotFoundException(`User not found by id ${id}`);
  // }

  // remove(id: string) {
  //   const userIndex = this.users.findIndex((user) => user.id === id);
  //   if (userIndex !== -1){
  //     return this.users.splice(userIndex)[0];
  //   }
  //   throw new NotFoundException(`User not found by id ${id}`);
  // }

  // queryUsers(paginationDtoStream: Observable<PaginationDto>): Observable<Users>{
  //   const subject = new Subject<Users>();
  //   const onNext = (paginationDto: PaginationDto) => {
  //     const start = paginationDto.page * paginationDto.skip;
  //     subject.next({
  //       users: this.users.slice(start, start + paginationDto.skip)
  //     });
  //   };

  //   const onComplete = () => subject.complete();

  //   paginationDtoStream.subscribe({
  //     next: onNext,
  //     complete: onComplete
  //   });

  //   return subject.asObservable();

  // }

  // findOneUserByPrimaryEmailAddress(primaryEmailAddress: string): User {
  //   return this.users.find((user) => user.primaryEmailAddress === primaryEmailAddress);
  // }
}

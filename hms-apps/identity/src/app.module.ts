import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { typeOrmConfig } from 'typeorm.config';
// import { User } from './users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'hms',
    synchronize: true,
    autoLoadEntities: true,
  }),UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

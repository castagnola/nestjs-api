import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  singUp = async (authCredentialDto: AuthCredentialsDto): Promise<void> => {
    const { username, password } = authCredentialDto;
    const user = this.userRepository.create({ username, password });
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, salt);

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code == 23505) {
        throw new ConflictException('Username already exist');
      } else {
        console.log(error.code);

        throw new InternalServerErrorException();
      }
    }
  };

  singIn = async (
    authCredentialDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> => {
    const { username, password } = authCredentialDto;
    const user = await this.userRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: { username: string } = { username };
      const accessToken: string = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  };
}

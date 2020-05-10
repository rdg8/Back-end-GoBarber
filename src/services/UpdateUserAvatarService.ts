import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can chage avatar.', 401);
    }

    if (user.avatar) {
      const userAvatarfilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarfileExists = await fs.promises.stat(userAvatarfilePath);

      if (userAvatarfileExists) {
        await fs.promises.unlink(userAvatarfilePath);
      }
    }

    user.avatar = avatarFileName;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;

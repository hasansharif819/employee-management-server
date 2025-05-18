export class UserEntity {
  id: number;
  name?: string;
  email: string;
  position: string;
  createdAt?: Date;

  constructor(user: Partial<UserEntity & { password?: string }>) {
    const { password, ...safeUser } = user;
    Object.assign(this, safeUser);
  }
}

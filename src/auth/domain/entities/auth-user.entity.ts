export class AuthUser {
  id: number;
  username: string;
  password: string;

  constructor(props: AuthUser) {
    Object.assign(this, props);
  }
}

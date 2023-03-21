import { Role } from '@prisma/client';

export class AuthenticatedUser {
  #id: number;
  #nickname: string;
  #email: string;
  #role: Role;

  constructor(id, email, nickname) {
    this.#id = id;
    this.#email = email;
    this.#nickname = nickname;
  }

  get id() {
    return this.#id;
  }

  get nickname() {
    return this.#nickname;
  }

  get email() {
    return this.#email;
  }

  get role() {
    return this.#role;
  }

  set role(role) {
    this.#role = role;
  }

  isAdmin(): boolean {
    return this.#role === Role.Admin;
  }

  isSuperAdmin(): boolean {
    return this.#role === Role.SuperAdmin;
  }
}

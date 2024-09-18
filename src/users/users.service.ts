import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DRIZZLE_PROVIDER } from 'src/drizzle/drizzle.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly conn: PostgresJsDatabase<typeof schema>,
  ) {}
  create(createUserDto: CreateUserDto) {
    this.conn.insert(schema.user).values(createUserDto).returning();
  }

  findAll() {
    return this.conn.select().from(schema.user);
  }

  findOne(id: number) {
    return this.conn.select().from(schema.user).where(eq(schema.user.id, id));
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const x = await this.conn
      .update(schema.user)
      .set(updateUserDto)
      .where(eq(schema.user.id, id))
      .returning({ id: schema.user.id });

    return x;
  }

  remove(id: number) {
    return this.conn.delete(schema.user).where(eq(schema.user.id, id));
  }
}

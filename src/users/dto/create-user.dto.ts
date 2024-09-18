import { InferInsertModel } from 'drizzle-orm';
import { user } from 'src/drizzle/schema';

export class CreateUserDto implements InferInsertModel<typeof user> {
  email: string;
  roleId: number;
}

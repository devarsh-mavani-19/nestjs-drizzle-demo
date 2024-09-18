import {
  integer,
  serial,
  text,
  pgTable,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const user = pgTable('users', {
  id: serial('id').primaryKey().notNull(),
  email: text('email').unique().notNull(),
  roleId: integer('roleId').notNull(),
});

export const role = pgTable('role', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  content: text('content'),
  userId: integer('userId'),
});

export const userRelations = relations(user, ({ one, many }) => ({
  user_role: one(role, {
    fields: [user.roleId],
    references: [role.id],
  }),
  user_posts: many(posts),
  user_groups: many(usersToGroups),
}));

export const postRelations = relations(posts, ({ one }) => ({
  post_user: one(user, {
    fields: [posts.userId],
    references: [user.id],
  }),
}));

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const usersToGroups = pgTable(
  'users_to_groups',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => user.id),
    groupId: integer('group_id')
      .notNull()
      .references(() => groups.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.groupId] }), //easy to misspell
  }),
);

export const groupsRelations = relations(groups, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),
  user: one(user, {
    fields: [usersToGroups.userId],
    references: [user.id],
  }),
}));

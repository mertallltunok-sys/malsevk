import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "shipper",
  "carrier",
]);

export const jobStatusEnum = pgEnum("job_status", [
  "open",
  "in_progress",
  "completed",
  "cancelled",
]);

export const offerStatusEnum = pgEnum("offer_status", [
  "pending",
  "accepted",
  "rejected",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  role: userRoleEnum("role").notNull().default("shipper"),
  city: varchar("city", { length: 100 }),
  rating: integer("rating").default(0),
  totalJobs: integer("total_jobs").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  fromCity: varchar("from_city", { length: 100 }).notNull(),
  toCity: varchar("to_city", { length: 100 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  weight: varchar("weight", { length: 50 }),
  vehicleType: varchar("vehicle_type", { length: 100 }),
  budget: integer("budget"),
  loadDate: varchar("load_date", { length: 50 }),
  deliveryDate: varchar("delivery_date", { length: 50 }),
  status: jobStatusEnum("status").notNull().default("open"),
  offerCount: integer("offer_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id")
    .references(() => jobs.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  price: integer("price").notNull(),
  deliveryTime: varchar("delivery_time", { length: 100 }),
  note: text("note"),
  status: offerStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id")
    .references(() => users.id)
    .notNull(),
  receiverId: integer("receiver_id")
    .references(() => users.id)
    .notNull(),
  jobId: integer("job_id").references(() => jobs.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

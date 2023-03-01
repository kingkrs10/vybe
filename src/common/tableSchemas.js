const { pgp } = require("./pgHelper");

const eventsColumns = `
  "eventId" uuid NOT NULL PRIMARY KEY,
  "userId" uuid NOT NULL,
  "name" character varying(150),
  "description" text,
  "category" character varying(30),
  "status" character varying(30),
  "type" character varying(10),
  "address" character varying(150),
  "country" character varying(30),
  "city" character varying(30),
  "state" character varying(30),
  "postalCode" character varying(10),
  "virtualUrl" text,
  "password" character varying(150), 
  "timezone" character varying(150), 
  "startDate" timestamp with time zone,
  "startTime" time with time zone DEFAULT current_time,
  "endDate" timestamp with time zone,
  "endTime" time with time zone,
  "endVisible" boolean DEFAULT true,
  "mapVisible" boolean DEFAULT false,
  "image" text,
  "website" text, 
  "twitter" character varying(150),
  "facebook" character varying(150),
  "instagram" character varying(150),
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT current_timestamp
`;

const ticketsColumns = `
  "ticketId" uuid NOT NULL PRIMARY KEY,
  "eventId" uuid NOT NULL,
  "name" character varying(150),
  "description" text,
  "type" character varying(10),
  "price" numeric,
  "quantity" numeric,
  "limit" numeric,
  "startDate" date DEFAULT current_date,
  "startTime" time with time zone DEFAULT current_time,
  "endDate" date,
  "endTime" time with time zone,
  "invitationOnly" boolean DEFAULT false,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT current_timestamp
`;

const transactionsColumns = `
  "transactionId" uuid NOT NULL PRIMARY KEY,
  "userId" uuid NOT NULL,
  "eventId" uuid NOT NULL,
  "stripeCustomerId" character varying(30),
  "totalAmount" numeric,
  "feeAmount" numeric,
  "subTotal" numeric,
  "rawData" jsonb,
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT current_timestamp
`;

const guestlistsColumns = `
  "guestlistId" uuid NOT NULL PRIMARY KEY,
  "ticketId" uuid NOT NULL,
  "eventId" uuid NOT NULL,
  "transactionId" uuid NOT NULL,
  "name" character varying(150),
  "email" character varying(150),
  "type" character varying(10),
  "price" numeric,
  "startDate" date DEFAULT current_date,
  "startTime" time with time zone DEFAULT current_time,
  "endDate" date,
  "endTime" time with time zone,
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT current_timestamp
`;

const usersColumns = `
  "userId" uuid NOT NULL PRIMARY KEY,
  "balance" numeric DEFAULT 0,
  "notificationUnReadcount" numeric,
  "deviceId" text[],
  "firstName" character varying(150),
  "lastName" character varying(150),
  "password" character varying(150),
  "emailAddress" character varying(150),
  "stripeCustomerId" character varying(30),
  "currencyCode" character varying(10),
  "currencySymbol" character varying(5),
  "phoneNumber" character varying(25),
  "firebaseUId" character varying(50),
  "country" character varying(150),
  "idMatch" boolean DEFAULT false,
  "senderId" uuid,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT current_timestamp
`;

const usersBlockedUsersColumns = `
  "userId" uuid NOT NULL,
  "blockedUserId" uuid NOT NULL,
  "createdAt" timestamp with time zone DEFAULT current_timestamp
`;

const usersCountryCurrencyColumns = `
  "userId" uuid NOT NULL,
  "amount" numeric,
  "oppPersonBalance" numeric,
  "currency" character varying(5),
  "label" character varying(5),
  "value" character varying(5),
  "balanceData" character varying(20),
  "createdAt" timestamp with time zone DEFAULT current_timestamp
`;

const usersInvitesColumns = `
  "senderUserId" uuid NOT NULL,
  "receiverUserId" uuid,
  "receiverPhoneNumber" character varying(25) NOT NULL,
  status bit(1) NOT NULL DEFAULT '0'::"bit",
  "createdAt" timestamp with time zone DEFAULT current_timestamp
`;

const statusColumns = `
  "statusId" uuid NOT NULL PRIMARY KEY,
  "statusName" character varying(250) NOT NULL,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT current_timestamp
`;

const paymentMethodsColumns = `
  "paymentMethodId" uuid NOT NULL PRIMARY KEY,
  "paymentMethodName" character varying(250),
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT current_timestamp
`;

const notificationsColumns = `
  "notificationId" uuid NOT NULL PRIMARY KEY,
  "offerId" uuid NOT NULL,
  "senderUserId" uuid NOT NULL,
  "receiverUserId" uuid NOT NULL,
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT current_timestamp
`;

const currencyColumns = `
  id uuid NOT NULL PRIMARY KEY,
  "currencyDetails" text[]
`;

const addressesColumns = `
  "addressId" uuid NOT NULL PRIMARY KEY,
  "firstName" character varying(250),
  "lastName" character varying(250),
  "streetAddress" text,
  "floorUnit" character varying(350),
  "country" text,
  "state" text,
  "city" text,
  "phoneNumber" character varying(25),
  "pincode" character varying(10),
  "userId" uuid NOT NULL,
  "isDefault" boolean DEFAULT false,
  "isActive" boolean DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT current_timestamp
`;

exports.eventsHelper = new pgp.helpers.ColumnSet(
  [
    "eventId",
    "userId",
    "name",
    "description",
    "category",
    "status",
    "type",
    "address",
    "country",
    "city",
    "state",
    "postalCode",
    "virtualUrl",
    "password",
    "timezone",
    "startDate",
    "startTime",
    "endDate",
    "endTime",
    "endVisible",
    "image",
    "website",
    "twitter",
    "facebook",
    "instagram",
    "isActive",
  ],
  {
    table: "events",
  }
);

exports.ticketsHelper = new pgp.helpers.ColumnSet(
  [
    "ticketId",
    "eventId",
    "name",
    "description",
    "type",
    "price",
    "quantity",
    "limit",
    "startDate",
    "startTime",
    "endDate",
    "endTime",
    "invitationOnly",
    "isActive",
  ],
  {
    table: "tickets",
  }
);

exports.usersHelper = new pgp.helpers.ColumnSet(
  [
    "userId",
    "balance",
    "notificationUnReadcount",
    "deviceId",
    "firstName",
    "lastName",
    "password",
    "emailAddress",
    "stripeCustomerId",
    "currencyCode",
    "currencySymbol",
    "phoneNumber",
    "firebaseUId",
    "country",
    "idMatch",
    "senderId",
  ],
  {
    table: "users",
  }
);

exports.usersBlockedUsersHelper = new pgp.helpers.ColumnSet(
  ["userId", "blockedUserId"],
  {
    table: "users_blockedUsers",
  }
);

exports.usersCountryCurrency = new pgp.helpers.ColumnSet(
  [
    "userId",
    "amount",
    "oppPersonBalance",
    "currency",
    "label",
    "value",
    "balanceData",
  ],
  {
    table: "users_countryCurrency",
  }
);

exports.usersInvitesHelper = new pgp.helpers.ColumnSet(
  ["senderUId", "receiverUId", "receiverPhoneNumber", "status"],
  {
    table: "users_invites",
  }
);

exports.statusHelper = new pgp.helpers.ColumnSet(
  ["statusId", "statusName", "isActive"],
  {
    table: "status",
  }
);

exports.paymentMethodsHelper = new pgp.helpers.ColumnSet(
  ["paymentMethodId", "paymentMethodName", "isActive"],
  {
    table: "paymentMethods",
  }
);

exports.addressesHelper = new pgp.helpers.ColumnSet(
  [
    "addressId",
    "firstName",
    "lastName",
    "streetAddress",
    "floorUnit",
    "country",
    "state",
    "city",
    "phoneNumber",
    "pincode",
    "userId",
    "isDefault",
    "isActive",
    "createdAt",
  ],
  {
    table: "addresses",
  }
);

exports.transactionsHelper = new pgp.helpers.ColumnSet(
  [
    "transactionId",
    "userId",
    "eventId",
    "totalAmount",
    "stripeCustomerId",
    "feeAmount",
    "subTotal",
    "rawData",
    "createdAt",
    "updatedAt",
  ],
  {
    table: "transactions",
  }
);

exports.guestlistsHelper = new pgp.helpers.ColumnSet(
  [
    "guestlistId",
    "ticketId",
    "eventId",
    "transactionId",
    "name",
    "email",
    "type",
    "price",
    "startDate",
    "startTime",
    "endDate",
    "endTime",
    "createdAt",
    "updatedAt",
  ],
  {
    table: "guestlists",
  }
);

exports.notificationsHelper = new pgp.helpers.ColumnSet(
  ["notificationId", "offerId", "senderUId", "receiverUId"],
  {
    table: "notifications",
  }
);

exports.eventsTbl = `CREATE TABLE IF NOT EXISTS public."events" ( ${eventsColumns} );`;
exports.ticketsTbl = `CREATE TABLE IF NOT EXISTS public."tickets" ( ${ticketsColumns} );`;
exports.usersTbl = `CREATE TABLE IF NOT EXISTS public."users" ( ${usersColumns} );`;
exports.usersBlockedUsersTbl = `CREATE TABLE IF NOT EXISTS public."users_blockedUsers" ( ${usersBlockedUsersColumns} );`;
exports.usersCountryCurrencyTbl = `CREATE TABLE IF NOT EXISTS public."users_countryCurrency" ( ${usersCountryCurrencyColumns} );`;
exports.usersInvitesTbl = `CREATE TABLE IF NOT EXISTS public."users_invites" ( ${usersInvitesColumns} );`;
exports.statusTbl = `CREATE TABLE IF NOT EXISTS public."status" ( ${statusColumns} );`;
exports.paymentMethodsTbl = `CREATE TABLE IF NOT EXISTS public."paymentMethods" ( ${paymentMethodsColumns} );`;
exports.transactionsTbl = `CREATE TABLE IF NOT EXISTS public."transactions" ( ${transactionsColumns} );`;
exports.notificationsTbl = `CREATE TABLE IF NOT EXISTS public."notifications" ( ${notificationsColumns} );`;
exports.guestlistsTbl = `CREATE TABLE IF NOT EXISTS public."guestlists" ( ${guestlistsColumns} );`;
exports.currencyTbl = `CREATE TABLE IF NOT EXISTS public."currency" ( ${currencyColumns} );`;
exports.addressesTbl = `CREATE TABLE IF NOT EXISTS public."addresses" ( ${addressesColumns} );`;

const { pgp } = require("./pgHelper");

const loansColumns = `
  "loanId" uuid NOT NULL PRIMARY KEY,
  "userId" uuid NOT NULL,
  "loanAmount" numeric,
  "loanDuration" character varying(10),
  "facilitationFee" numeric,
  "isActive" boolean NOT NULL DEFAULT true,
  "dueAt" timestamp with time zone DEFAULT current_timestamp,
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT current_timestamp
`;

const usersColumns = `
  "userId" uuid NOT NULL PRIMARY KEY,
  balance numeric DEFAULT 0,
  "notificationUnReadcount" numeric,
  "deviceId" text[],
  "firstName" character varying(150),
  "lastName" character varying(150),
  "emailAddress" character varying(150),
  "stripeCustomerId" character varying(30),
  "currencyCode" character varying(10),
  "currencySymbol" character varying(5),
  "phoneNumber" character varying(25),
  "firebaseUId" character varying(50),
  "dateOfBirth" timestamp with time zone,
  "gender" character varying(10),
  "city" character varying(10),
  "education" character varying(50),
  "employer" character varying(150),
  monthlyRent numeric,
  monthlyIncome numeric,
  creditScore numeric,
  "idMatch" boolean DEFAULT false,
  "familyStatus" character varying(25),
  "hasCar" boolean DEFAULT false,
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
  amount numeric,
  "oppPersonBalance" numeric,
  currency character varying(5),
  label character varying(5),
  value character varying(5),
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

const transactionHistoriesColumns = `
  "transactionId" uuid NOT NULL  PRIMARY KEY,
  "senderUserId" uuid NOT NULL,
  "receiverUserId" uuid NOT NULL,
  amount numeric,
  "senderCurrencyCode" character varying(10),
  "senderSymbol" character varying(5),
  "firebaseTransactionId" character varying(50),
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT current_timestamp
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

const shippingAddressesColumns = `
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

exports.loansHelper = new pgp.helpers.ColumnSet(
  [
    "loanId",
    "userId",
    "loanAmount",
    "loanDuration",
    "facilitationFee",
    "isActive",
  ],
  {
    table: "loans",
  }
);

exports.usersHelper = new pgp.helpers.ColumnSet(
  [
    "userId",
    "balance",
    "notificationUnReadcount",
    "deviceId",
    "fisrtName",
    "lastName",
    "emailAddress",
    "stripeCustomerId",
    "currencyCode",
    "currencySymbol",
    "isActive",
    "phoneNumber",
    "firebaseUId",
    "dateOfBirth",
    "gender",
    "city",
    "education",
    "employer",
    "monthlyRent",
    "monthlyIncome",
    "creditScore",
    "idMatch",
    "familyStatus",
    "hasCar",
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

exports.shipppingAddressesHelper = new pgp.helpers.ColumnSet(
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
    table: "shippingAddresses",
  }
);

exports.transactionHistoriesHelper = new pgp.helpers.ColumnSet(
  [
    "transactionId",
    "amount",
    "senderUId",
    "receiverUId",
    "senderCurrencyCode",
    "senderSymbol",
    "firebaseTransactionId",
    "createdAt",
  ],
  {
    table: "transactionHistories",
  }
);

exports.notificationsHelper = new pgp.helpers.ColumnSet(
  ["notificationId", "offerId", "senderUId", "receiverUId"],
  {
    table: "notifications",
  }
);

exports.loansTbl = `CREATE TABLE IF NOT EXISTS public.loans ( ${loansColumns} );`;
exports.usersTbl = `CREATE TABLE IF NOT EXISTS public.users ( ${usersColumns} );`;
exports.usersBlockedUsersTbl = `CREATE TABLE IF NOT EXISTS public."users_blockedUsers" ( ${usersBlockedUsersColumns} );`;
exports.usersCountryCurrencyTbl = `CREATE TABLE IF NOT EXISTS public."users_countryCurrency" ( ${usersCountryCurrencyColumns} );`;
exports.usersInvitesTbl = `CREATE TABLE IF NOT EXISTS public.users_invites ( ${usersInvitesColumns} );`;
exports.statusTbl = `CREATE TABLE IF NOT EXISTS public.status ( ${statusColumns} );`;
exports.paymentMethodsTbl = `CREATE TABLE IF NOT EXISTS public."paymentMethods" ( ${paymentMethodsColumns} );`;
exports.transactionHistoriesTbl = `CREATE TABLE IF NOT EXISTS public."transactionHistories" ( ${transactionHistoriesColumns} );`;
exports.notificationsTbl = `CREATE TABLE IF NOT EXISTS public.notifications ( ${notificationsColumns} );`;
exports.currencyTbl = `CREATE TABLE IF NOT EXISTS public.currency ( ${currencyColumns} );`;
exports.shippingAddressesTbl = `CREATE TABLE IF NOT EXISTS public."shippingAddresses" (${shippingAddressesColumns})`;

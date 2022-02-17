const { pgp } = require("./pgHelper");

const categoriesColumns = `
  "categoryId" uuid NOT NULL PRIMARY KEY,
  "parentId" uuid NOT NULL,
  "categoryName" character varying(250),
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT current_timestamp
`;

const categoryItemsColumns = `
  "categoryItemId" uuid NOT NULL PRIMARY KEY,
  "categoryId" uuid NOT NULL,
  "categoryItemName" character varying(250),
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT current_timestamp
`;

const menusColumns = `
  "menuId" uuid NOT NULL PRIMARY KEY,
  "menuName" character varying(250),
  "keyCode" character varying(20),
  "order" numeric,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT current_timestamp
`;

const offersColumns = `
  "offerId" uuid NOT NULL PRIMARY KEY,
  "userId" uuid NOT NULL,
  "headLine" text,
  latitude numeric,
  longitude numeric,
  "offerDescription" text,
  "locationName" character varying(150),
  "firebaseOfferId" character varying(50),
  "offerImage" text[],
  "offerThumpImage" text[],
  "offerMediumImage" text[],
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT current_timestamp
`;

const offersFavoritesColumns = `
  "offerId" uuid NOT NULL,
  "userId" uuid NOT NULL,
  "createdAt" timestamp with time zone DEFAULT current_timestamp
`;

const offersHashTagsColumns = `
  "offerId" uuid NOT NULL,
  "hashTag"  character varying(250),
  "createdAt" timestamp with time zone DEFAULT current_timestamp
`;

const offersReportsColumns = `
  "offerId" uuid NOT NULL,
  "reporterUserId" uuid NOT NULL,
  comment text,
  "createdAt" timestamp with time zone DEFAULT current_timestamp
`;

const usersColumns = `
  "userId" uuid NOT NULL PRIMARY KEY,
  balance numeric,
  "notificationUnReadcount" numeric,
  "deviceId" text[],
  "fullName" character varying(150),
  "stripeCustomerId" character varying(30),
  latitude numeric,
  longitude numeric,
  "currencyCode" character varying(10),
  "currencySymbol" character varying(5),
  profession character varying(150),
  "phoneNumber" character varying(25),
  "firebaseUId" character varying(50),
  "userImage" text,
  "userThumpImage" text,
  "userMediumImage" text,
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

const shopsColumns = `
  "shopId" uuid NOT NULL PRIMARY KEY,
  "userId" uuid,
  "shopName" character varying(250) NOT NULL,
  "shopDescription" text,
  "shopShortDescription" text,
  "locationName" character varying(250),
  latitude numeric,
  longitude numeric,
  "shopImageURL" text[],
  "shopThumpImageURL" text[],
  "shopMediumImageURL" text[],
  "socialMedia" jsonb,
  shipping_processing_time jsonb,
  shipping_customs_and_import_taxes jsonb,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT current_timestamp
`;

const shopCategoryItemsColumns = `
  "shopCategoryItemId" uuid NOT NULL PRIMARY KEY,
  "shopId" uuid NOT NULL,
  "categoryItemId" uuid NOT NULL,
  "isActive" boolean NOT NULL DEFAULT true
`;

const shopCollectionColumns = `
  "shopCollectionId" uuid NOT NULL PRIMARY KEY,
  "shopId" uuid NOT NULL,
  "collectionName" character varying(250),
  "collectionDescription" text,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT current_timestamp
`;

const shopMemberColumns = `
  "shopMemberId" uuid NOT NULL PRIMARY KEY,
  "shopId" uuid NOT NULL,
  "userId" uuid NOT NULL,
  designation character varying(150),
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT current_timestamp
`;

const productsColumns = `
  "productId" uuid NOT NULL PRIMARY KEY,
  "productShopId" uuid,
  "productName" character varying(250),
  "productDescription" text,
  "productPrice" numeric DEFAULT 0,
  "productDiscount" numeric DEFAULT 0,
  "productTotalQty" numeric DEFAULT 0,
  "productSoldQty" numeric DEFAULT 0,
  "productDamageQty" numeric DEFAULT 0,
  "productImageURL" text[],
  "productThumpImageURL" text[],
  "productMediumImageURL" text[],
  "productCategoryItemId" uuid,
  "productCurrency" character varying(25),
  "productCollectionIds" text[],
  "productOptions" jsonb,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT current_timestamp
`;

const productReviewsColumns = `
  "productReviewId" uuid NOT NULL PRIMARY KEY,
  "userId" uuid NOT NULL,
  "productId" uuid NOT NULL,
  "title" character varying(250),
  "description" text,
  "ratings" numeric NOT NULL DEFAULT 0,
  "reviewImageURL" text[],
  "reviewThumpImageURL" text[],
  "reviewMediumImageURL" text[],
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT current_timestamp
`;

const ordersColumns = `
  "orderId" uuid NOT NULL PRIMARY KEY,
  "userId" uuid NOT NULL,
  "shopId" uuid NOT NULL,
  "orderTotalQty" numeric DEFAULT 0,
  "orderSubTotalPrice" numeric DEFAULT 0,
  "OrderTaxPrice" numeric DEFAULT 0,
  "OrderShippingPrice" numeric DEFAULT 0,
  "orderDiscount" numeric DEFAULT 0,
  "orderTotalPrice" numeric DEFAULT 0,
  "orderStatusId" uuid,
  "orderPaymentMethodId" uuid,
  "orderPaymentStatusId" uuid,
  "orderPaymentTransactionId" character varying(150),
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT current_timestamp
`;

const orderItemsColumns = `
  "orderItemId" uuid NOT NULL PRIMARY KEY,
  "orderId" uuid,
  "productId" uuid,
  "shopId" uuid NOT NULL,
  "userId" uuid NOT NULL,
  "productName" character varying(250),
  "orderItemQty" numeric DEFAULT 0,
  "orderItemPrice" numeric DEFAULT 0,
  "orderItemDiscount" numeric DEFAULT 0,
  "orderItemTotalPrice" numeric,
  "orderItemsproductOptions" jsonb,
  "isActive" boolean DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT current_timestamp
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

const messagesColumns = `
  "messageId" uuid NOT NULL PRIMARY KEY,
  "chatId" uuid NOT NULL,
  "messageFromUserId" uuid NOT NULL,
  "messageToUserId" uuid NOT NULL,
  message text,
  "messageType" character varying(30),
  "isRead" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT current_timestamp
`;

const currencyColumns = `
  id uuid NOT NULL PRIMARY KEY,
  "currencyDetails" text[]
`;

const chatsColumns = `
  "chatId" uuid NOT NULL PRIMARY KEY,
  "messageFromUserId" uuid NOT NULL,
  "messageToUserId" uuid NOT NULL,
  "lastMessage" text,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT current_timestamp
`;

const serviceColumns = `
  "serviceId" uuid NOT NULL PRIMARY KEY,
  "userId" uuid,
  "categoryId" uuid,
  "subCategoryItemId" uuid,
  "serviceName" character varying(250) NOT NULL,
  "serviceDescription" text,
  "locationName" text,
  "latitude" numeric,
  "longitude" numeric,
  "serviceStartingPrice" numeric,
  "paymentMethods" jsonb,
  "serviceImageURL" text[],
  "serviceThumpImageURL" text[],
  "serviceMediumImageURL" text[],
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
`;
const serviceBookingColumns = `
  "serviceBookingId" uuid NOT NULL PRIMARY KEY,
  "serviceName" character varying(250),
  "serviceId" uuid NOT NULL,
  "userId" uuid NOT NULL,
  "bookingDate" timestamp with time zone,
  "bookingJobDetails" text,
  "locationName" text,
  "latitude" numeric,
  "longitude" numeric,
  "bookingStatus" uuid NOT NULL,
  "paymentStatus" uuid NOT NULL,
  "createdAt" timestamp with time zone DEFAULT current_timestamp,
  "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
  `;
const serviceReviewsColumns = `
  "serviceReviewId" uuid NOT NULL,
  "userId" uuid NOT NULL,
  "serviceId" uuid NOT NULL,
  "ratings" numeric NOT NULL DEFAULT 0,
  "title" character varying(250),
  "description" text,
  "reviewImageURL" text[],
  "reviewThumpImageURL" text[],
  "reviewMediumImageURL" text[],
  "isActive" boolean DEFAULT true,
  "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
 `;
const shippingAddressesColumns = `
  "addressId" uuid NOT NULL PRIMARY KEY,
  "firstName" character varying(250),
  "lastName" character varying(250),
  "streetAddress" text,
  "place" character varying(350),
  "pincode" character varying(10),
  "userId" uuid NOT NULL
`;

exports.categoriesHelper = new pgp.helpers.ColumnSet(
  ["categoryId", "parentId", "categoryName", "isActive", "createdAt"],
  {
    table: "categories"
  }
);

exports.categoriesHelper = new pgp.helpers.ColumnSet(
  ["categoryItemId", "categoryId", "categoryItemName", "isActive", "createdAt"],
  {
    table: "categoryItems"
  }
);

exports.menusHelper = new pgp.helpers.ColumnSet(
  ["menuId", "menuName", "keyCode", "order"],
  {
    table: "menus"
  }
);

exports.offersHelper = new pgp.helpers.ColumnSet(
  [
    "offerId",
    "userId",
    "headLine",
    "latitude",
    "longitude",
    "offerDescription",
    "locationName",
    "firebaseOfferId",
    "offerImage",
    "offerThumpImage",
    "offerMediumImage",
    "isActive"
  ],
  {
    table: "offers"
  }
);

exports.usersHelper = new pgp.helpers.ColumnSet(["offerId", "userId"], {
  table: "offers_favorites"
});

exports.offersHashTagsHelper = new pgp.helpers.ColumnSet(
  ["offerId", "hashTag"],
  {
    table: "offers_hashTags"
  }
);

exports.offersReportsHelper = new pgp.helpers.ColumnSet(
  ["offerId", "reporterUserId", "comment"],
  {
    table: "offers_reports"
  }
);

exports.usersHelper = new pgp.helpers.ColumnSet(
  [
    "userId",
    "balance",
    "notificationUnReadcount",
    "deviceId",
    "fullName",
    "userImage",
    "stripeCustomerId",
    "latitude",
    "longitude",
    "currencyCode",
    "currencySymbol",
    "profession",
    "isActive",
    "phoneNumber",
    "firebaseUId",
    "userThumpImage",
    "userMediumImage"
  ],
  {
    table: "users"
  }
);

exports.usersBlockedUsersHelper = new pgp.helpers.ColumnSet(
  ["userId", "blockedUserId"],
  {
    table: "users_blockedUsers"
  }
);

exports.usersInvitesHelper = new pgp.helpers.ColumnSet(
  [
    "userId",
    "amount",
    "oppPersonBalance",
    "currency",
    "label",
    "value",
    "balanceData"
  ],
  {
    table: "users_countryCurrency"
  }
);

exports.usersInvitesHelper = new pgp.helpers.ColumnSet(
  ["senderUId", "receiverUId", "receiverPhoneNumber", "status"],
  {
    table: "users_invites"
  }
);

exports.statusHelper = new pgp.helpers.ColumnSet(
  ["statusId", "statusName", "isActive"],
  {
    table: "status"
  }
);

exports.paymentMethodsHelper = new pgp.helpers.ColumnSet(
  ["paymentMethodId", "paymentMethodName", "isActive"],
  {
    table: "paymentMethods"
  }
);

exports.shopsHelper = new pgp.helpers.ColumnSet(
  [
    "shopId",
    "shopName",
    "shopDescription",
    "shopShortDescription",
    "locationName",
    "latitude",
    "longitude",
    "shopImageURL",
    "shopThumpImageURL",
    "shopMediumImageURL",
    "socialMedia",
    "shipping_processing_time",
    "shipping_customs_and_import_taxes",
    "isActive",
    "createdAt"
  ],
  {
    table: "shops"
  }
);

exports.shopCategoryItemsHelper = new pgp.helpers.ColumnSet(
  ["shopCategoryItemId", "shopId", "categoryItemId", "isActive"],
  {
    table: "shop_categoryItems"
  }
);

exports.shopCollectionsHelper = new pgp.helpers.ColumnSet(
  [
    "shopCollectionId",
    "shopId",
    "collectionName",
    "collectionDescription",
    "isActive"
  ],
  {
    table: "shopCollections"
  }
);

exports.shopMembersHelper = new pgp.helpers.ColumnSet(
  ["shopMemberId", "shopId", "userId", "designation", "isActive", "createdAt"],
  {
    table: "shop_members"
  }
);

exports.productsHelper = new pgp.helpers.ColumnSet(
  [
    "productId",
    "productShopId",
    "productName",
    "productDescription",
    "productPrice",
    "productDiscount",
    "productTotalQty",
    "productSoldQty",
    "productDamageQty",
    "productImageURL",
    "productThumpImageURL",
    "productMediumImageURL",
    "productCategoryItemId",
    "productCurrency",
    "productCollectionIds",
    "productOptions",
    "isActive",
    "createdAt"
  ],
  {
    table: "products"
  }
);

exports.productReviewsHelper = new pgp.helpers.ColumnSet(
  [
    "productReviewId",
    "productId",
    "userId",
    "ratings",
    "title",
    "description",
    "reviewImageURL",
    "reviewThumpImageURL",
    "reviewMediumImageURL",
    "isActive",
    "createdAt"
  ],
  {
    table: "productReviews"
  }
);

exports.ordersHelper = new pgp.helpers.ColumnSet(
  [
    "orderId",
    "userId",
    "shopId",
    "orderTotalQty",
    "orderSubTotalPrice",
    "OrderTaxPrice",
    "OrderShippingPrice",
    "orderDiscount",
    "orderTotalPrice",
    "orderStatusId",
    "orderPaymentMethodId",
    "orderPaymentStatusId",
    "orderPaymentTransactionId"
  ],
  {
    table: "orders"
  }
);

exports.orderItemsHelper = new pgp.helpers.ColumnSet(
  [
    "orderItemId",
    "orderId",
    "productId",
    "shopId",
    "userId",
    "orderItemQty",
    "orderItemPrice",
    "orderItemDiscount",
    "orderItemTotalPrice",
    "productOptions",
    "isActive",
    "createdAt",
    "updatedAt"
  ],
  {
    table: "orderItems"
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
    "createdAt"
  ],
  {
    table: "transactionHistories"
  }
);

exports.notificationsHelper = new pgp.helpers.ColumnSet(
  ["notificationId", "offerId", "senderUId", "receiverUId"],
  {
    table: "notifications"
  }
);

exports.messagesHelper = new pgp.helpers.ColumnSet(["id", "currencyDetails"], {
  table: "currency"
});

exports.messagesHelper = new pgp.helpers.ColumnSet(
  [
    "chatId",
    "messageFromUId",
    "messageToUId",
    "lastMessage",
    "isActive",
    "createdAt"
  ],
  {
    table: "chats"
  }
);

exports.servicesHelper = new pgp.helpers.ColumnSet(
  [
    "serviceId",
    "userId",
    "categoryId",
    "subCategoryItemId",
    "serviceName",
    "serviceDescription",
    "locationName",
    "latitude",
    "longitude",
    "serviceStartingPrice",
    "paymentOptions",
    "serviceImageURL",
    "serviceThumpImageURL",
    "serviceMediumImageURL",
    "isActive",
    "createdAt",
    "updatedAt"
  ],
  {
    table: "services"
  }
);

exports.serviceBookingHelper = new pgp.helpers.ColumnSet(
  [
    "serviceBookingId",
    "serviceName",
    "serviceId",
    "userId",
    "bookingDate",
    "bookingJobDetails",
    "bookingStatus",
    "paymentStatus",
    "locationName",
    "latitude",
    "longitude",
    "createdAt",
    "updatedAt"
  ],
  {
    table: "serviceBooking"
  }
);

exports.serviceReviewsHelper = new pgp.helpers.ColumnSet(
  [
    "serviceReviewId",
    "userId",
    "serviceId",
    "ratings",
    "title",
    "description",
    "reviewImageURL",
    "reviewThumpImageURL",
    "reviewMediumImageURL",
    "isActive",
    "createdAt",
    "updatedAt"
  ],
  {
    table: "serviceReviews"
  }
);



exports.categoriesTbl = `CREATE TABLE IF NOT EXISTS public.categories ( ${categoriesColumns} );`;
exports.categoryItemsTbl = `CREATE TABLE IF NOT EXISTS public."categoryItems" ( ${categoryItemsColumns} );`;
exports.menusTbl = `CREATE TABLE IF NOT EXISTS public.menus ( ${menusColumns} );`;
exports.offersTbl = `CREATE TABLE IF NOT EXISTS public.offers ( ${offersColumns} );`;
exports.offersFavoritesTbl = `CREATE TABLE IF NOT EXISTS public.offers_favorites ( ${offersFavoritesColumns} );`;
exports.offersHashTagsTbl = `CREATE TABLE IF NOT EXISTS public."offers_hashTags" ( ${offersHashTagsColumns} );`;
exports.offersReportsTbl = `CREATE TABLE IF NOT EXISTS public.offers_reports ( ${offersReportsColumns} );`;
exports.usersTbl = `CREATE TABLE IF NOT EXISTS public.users ( ${usersColumns} );`;
exports.usersBlockedUsersTbl = `CREATE TABLE IF NOT EXISTS public."users_blockedUsers" ( ${usersBlockedUsersColumns} );`;
exports.usersCountryCurrencyTbl = `CREATE TABLE IF NOT EXISTS public."users_countryCurrency" ( ${usersCountryCurrencyColumns} );`;
exports.usersInvitesTbl = `CREATE TABLE IF NOT EXISTS public.users_invites ( ${usersInvitesColumns} );`;
exports.statusTbl = `CREATE TABLE IF NOT EXISTS public.status ( ${statusColumns} );`;
exports.paymentMethodsTbl = `CREATE TABLE IF NOT EXISTS public."paymentMethods" ( ${paymentMethodsColumns} );`;
exports.shopsTbl = `CREATE TABLE IF NOT EXISTS public.shops ( ${shopsColumns} );`;
exports.shopCategoryItemsTbl = `CREATE TABLE IF NOT EXISTS public."shop_categoryItems" ( ${shopCategoryItemsColumns} );`;
exports.shopCollectionsTbl = `CREATE TABLE IF NOT EXISTS public."shopCollections" ( ${shopCollectionColumns} );`;
exports.shopMembersTbl = `CREATE TABLE IF NOT EXISTS public.shop_members ( ${shopMemberColumns} );`;
exports.productsTbl = `CREATE TABLE IF NOT EXISTS public.products ( ${productsColumns} );`;
exports.productReviewsTbl = `CREATE TABLE IF NOT EXISTS public."productReviews" ( ${productReviewsColumns} );`;
exports.ordersTbl = `CREATE TABLE IF NOT EXISTS public.orders ( ${ordersColumns} );`;
exports.orderItemsTbl = `CREATE TABLE IF NOT EXISTS public."orderItems" ( ${orderItemsColumns} );`;
exports.transactionHistoriesTbl = `CREATE TABLE IF NOT EXISTS public."transactionHistories" ( ${transactionHistoriesColumns} );`;
exports.notificationsTbl = `CREATE TABLE IF NOT EXISTS public.notifications ( ${notificationsColumns} );`;
exports.messagesTbl = `CREATE TABLE IF NOT EXISTS public.messages ( ${messagesColumns} );`;
exports.currencyTbl = `CREATE TABLE IF NOT EXISTS public.currency ( ${currencyColumns} );`;
exports.chatsTbl = `CREATE TABLE IF NOT EXISTS public.chats ( ${chatsColumns} );`;
exports.serviceTbl = `CREATE TABLE IF NOT EXISTS public.services ( ${serviceColumns} );`;
exports.serviceBookingTbl = `CREATE TABLE IF NOT EXISTS public."serviceBooking" (${serviceBookingColumns});`;
exports.serviceReviewsTbl = `CREATE TABLE IF NOT EXISTS public."serviceReviews" (${serviceReviewsColumns});`;
exports.shippingAddressesTbl = `CREATE TABLE IF NOT EXISTS public."shippingAddresses" (${shippingAddressesColumns})`;

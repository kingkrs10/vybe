PGDMP                          y            luhu-development    13.1    13.1     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16877    luhu-development    DATABASE     n   CREATE DATABASE "luhu-development" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'English_India.1252';
 "   DROP DATABASE "luhu-development";
                postgres    false            �            1259    16936    chats    TABLE     K  CREATE TABLE public.chats (
    "chatId" uuid NOT NULL,
    "messageFromUId" uuid NOT NULL,
    "messageToUId" uuid NOT NULL,
    "lastMessage" text,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "lastModified" timestamp with time zone DEFAULT now() NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);
    DROP TABLE public.chats;
       public         heap    postgres    false            �            1259    16967    currency    TABLE     U   CREATE TABLE public.currency (
    id uuid NOT NULL,
    "currencyDetails" text[]
);
    DROP TABLE public.currency;
       public         heap    postgres    false            �            1259    16947    messages    TABLE       CREATE TABLE public.messages (
    "messageId" uuid NOT NULL,
    "chatId" uuid NOT NULL,
    "messageFromUId" uuid NOT NULL,
    "messageToUId" uuid NOT NULL,
    message text,
    "messageType" character varying(30),
    "unreadMessage" boolean DEFAULT true NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.messages;
       public         heap    postgres    false            �            1259    16958    notifications    TABLE     �   CREATE TABLE public.notifications (
    "notificationId" uuid NOT NULL,
    "offerId" uuid NOT NULL,
    "senderUId" uuid NOT NULL,
    "receiverUId" uuid NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
 !   DROP TABLE public.notifications;
       public         heap    postgres    false            �            1259    16903    offers    TABLE       CREATE TABLE public.offers (
    "offerId" uuid NOT NULL,
    "headLine" text,
    latitude numeric,
    longitude numeric,
    "offerDescription" text,
    uid uuid NOT NULL,
    "locationName" character varying(150),
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "firebaseOfferId" character varying(50),
    "imageURl" text[],
    "thump_imageURL" text[],
    "medium_imageURL" text[]
);
    DROP TABLE public.offers;
       public         heap    postgres    false            �            1259    16914    offers_favorites    TABLE     �   CREATE TABLE public.offers_favorites (
    "offerId" uuid NOT NULL,
    uid uuid NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
 $   DROP TABLE public.offers_favorites;
       public         heap    postgres    false            �            1259    16918    offers_hashTags    TABLE     m   CREATE TABLE public."offers_hashTags" (
    "offerId" uuid NOT NULL,
    "hashTag" character varying(250)
);
 %   DROP TABLE public."offers_hashTags";
       public         heap    postgres    false            �            1259    16921    offers_reports    TABLE     w   CREATE TABLE public.offers_reports (
    "offerId" uuid NOT NULL,
    "reporterUId" uuid NOT NULL,
    comment text
);
 "   DROP TABLE public.offers_reports;
       public         heap    postgres    false            �            1259    16927    transaction_histories    TABLE     r  CREATE TABLE public.transaction_histories (
    "transactionId" uuid NOT NULL,
    amount numeric,
    "senderUId" uuid NOT NULL,
    "receiverUId" uuid NOT NULL,
    "senderCurrencyCode" character varying(10),
    "senderSymbol" character varying(5),
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "firebaseTransactionId" character varying(50)
);
 )   DROP TABLE public.transaction_histories;
       public         heap    postgres    false            �            1259    16878    users    TABLE     �  CREATE TABLE public.users (
    uid uuid NOT NULL,
    balance numeric,
    "notificationUnReadcount" numeric,
    "deviceId" text[],
    "fullName" character varying(150),
    "imageURl" text,
    "stripeCustomerId" character varying(30),
    latitude numeric,
    longitude numeric,
    "currencyCode" character varying(10),
    "currencySymbol" character varying(5),
    profession character varying(150),
    "isActive" boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    "phoneNumber" character varying(25),
    "firebaseUId" character varying(50),
    "thump_imageURL" text,
    "medium_imageURL" text
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16888    users_blockedUsers    TABLE     g   CREATE TABLE public."users_blockedUsers" (
    uid uuid NOT NULL,
    "blockedUserId" uuid NOT NULL
);
 (   DROP TABLE public."users_blockedUsers";
       public         heap    postgres    false            �            1259    16978    users_countryCurrency    TABLE       CREATE TABLE public."users_countryCurrency" (
    uid uuid NOT NULL,
    amount numeric,
    "oppPersonBalance" numeric,
    currency character varying(5),
    label character varying(5),
    value character varying(5),
    "balanceData" character varying(20)
);
 +   DROP TABLE public."users_countryCurrency";
       public         heap    postgres    false            �            1259    16899    users_invites    TABLE     �   CREATE TABLE public.users_invites (
    "senderUId" uuid NOT NULL,
    "receiverUId" uuid,
    "receiverPhoneNumber" character varying(25) NOT NULL,
    status bit(1) DEFAULT '0'::"bit" NOT NULL
);
 !   DROP TABLE public.users_invites;
       public         heap    postgres    false            o           2606    16943    chats chats_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY ("chatId");
 :   ALTER TABLE ONLY public.chats DROP CONSTRAINT chats_pkey;
       public            postgres    false    208            u           2606    16974    currency currency_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.currency
    ADD CONSTRAINT currency_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.currency DROP CONSTRAINT currency_pkey;
       public            postgres    false    211            q           2606    16954    messages messages_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY ("messageId");
 @   ALTER TABLE ONLY public.messages DROP CONSTRAINT messages_pkey;
       public            postgres    false    209            s           2606    16965     notifications notifications_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY ("notificationId");
 J   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_pkey;
       public            postgres    false    210            k           2606    16910    offers offers_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_pkey PRIMARY KEY ("offerId");
 <   ALTER TABLE ONLY public.offers DROP CONSTRAINT offers_pkey;
       public            postgres    false    203            m           2606    16934 0   transaction_histories transaction_histories_pkey 
   CONSTRAINT     {   ALTER TABLE ONLY public.transaction_histories
    ADD CONSTRAINT transaction_histories_pkey PRIMARY KEY ("transactionId");
 Z   ALTER TABLE ONLY public.transaction_histories DROP CONSTRAINT transaction_histories_pkey;
       public            postgres    false    207            i           2606    16885    users users_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (uid);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    200           
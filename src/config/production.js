module.exports = {
   relational_db: {
      host: "35.202.0.126",
      port: 5432,
      user: "postgres",
      pass: "n9Lyi5Eboh1O3KKt",
      name: "luhu-production",
      cloudpath: "/cloudsql/luhu-dev:us-central1:luhu-development-db-postgres",
   },
   app: {
      port: 8081,
      secretKey: "luhu-jwt-stuff-secret"
   },
   stripe_api_key:
      "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",
   firebaseProjectId: "luhu-production.appspot.com",
   serviceAccountKey: {
      type: "service_account",
      project_id: "luhu-production",
      private_key_id: "9f8f2ae055146156f610cfc6ad39f9153649a32a",
      private_key:
         "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCRQ9soAQ0nTsXD\nA8LRkLlpOWTz158jBjAC9X0KF6CQASSp60vDpYNFQLu94p1Ts9hqHbmpX/2dD9Ne\n4OYjk6wwbP5GvEbN5Pbb5WjCP1UiM2tw9Gso6Sf1K7U21hzKVrD1WnfBgfM0cgZC\nQ2cVrdHet8DF4MNDUIp6n2YdFkeHfV+eO1q+nzT0WxkWBBpdOpxiy1yXABBaBF+Y\nGBLD+pktypUT5awKi275Chxr0Pl9iuH9/G626s2J5UwRZzgti4NvAIiGvs+v9IwZ\nvQM8EIJobCHV+SpFdPA0xjpw3DsHllxlcwoIn/ckzJ05D5ndNi7RGcIn/aw14VXK\nKusn87fHAgMBAAECggEAJvYNri2WAxBwH01/b6jC6fOAXZxb7M9oiiqgllfe8zCz\nTjWzNO7MBgOGNzg0HTKT3WZKmSCLS5hmh0CHyUv+t2BMVNmDng6GnVTq44qMAWfM\nLdgIc8kRNAM8j9AembBltvDEROzfN5ZLknM0j053Bya+t/QAOyo7cgcVosCKf86b\nnwKujXwwl+BVD9sZqzdsqhzXjS++P4G/MF5hzwGwpkes+2sGNWQfI+PCvQ2m0SLX\nzhcJxrMNR4vk5HgI4znhaD2XTJhwU92wXiaTO1RJr3M6AJ/G+dI7QwvNBiXOXSMN\nETmWJzkigobVUOzkTGg+eURV22b+l6B3yTUDQT+0FQKBgQDGDRUjSCLXpckIbYGV\n70iBhNTpRgU8bbfgjVP07kBsdqZMNbtPaKb88LqWEgz+dq0snVLDdD9jOsNPtBFD\nAiO+qKY0dV9Oh+JT1Djj83LxuaBW6blIvL6LSfqeFQgRLFy3lJ5kCf8YIxBawC3+\nTgN1Pc07fv8Tf45BTKY8sL7M0wKBgQC7xNylM2DYMpY3e7rwK30OIzNAyS4aAk4h\nwephjVnhzFl9nDn+mcZ+dJiRrUrHvhZIk+EukRAvNOhZcDRgAf7rgZaua7BOnz3Q\nX7BGYAFOmEgCpazczJ1MkbwxlTxL5LcEAoGoJUb6b5R1VV0fTxRF7eAsvtBMI8tl\nJp/quH+AvQKBgCbye62sie2OlLIrlsg9fiy6SoR1WKJBkV9/a3tHPzQVQS7LgkJj\nejNTw92vPw7rl7KmXZhCTBTfgXkzGBHtYcoksEqwqkVvQ3roySdKwNf4gSeWXvGG\n7JHHwplD2YpHBxSzDVLvBFNi0dyG3oScIuHzfWCt4Muc0gTVZfuZZmwxAoGBAJZB\npr+cKbdYY9TqcmGWq3AQwwbo9rdheNySrNh7oJ2MRWC7D72pmKnA7AZHQjws5PAX\nRm9ZLjZYhEZt/7uEXVZgURAqpN+FlpWUvR7T3LfkLFvR8E6Qfp+zT4HuBl5FHB9d\nUhwYGIB3oblzIh3XzkVXYbjsyQrk6fJ7wiS2l3GRAoGBAIrH1uQU3KnXH8/0jYDA\n0Zp5ExHFpxfI+oRT6BHWoxDPa0enj7j+F1TICU4pPSr9k0BuA4rT5VbK8MysjxgW\nhaGyvD4ZJR1FGpRrFsJC4wVYGtFs0aL9mPeyOdal9ioLr6weD1jH7HfDylsjStNZ\nW0c9AQ6eAkDaZoAW+ImiCuPt\n-----END PRIVATE KEY-----\n",
      client_email:
         "firebase-adminsdk-pb4nj@luhu-production.iam.gserviceaccount.com",
      client_id: "117413583041352807383",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
         "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-pb4nj%40luhu-production.iam.gserviceaccount.com",
   },
   twilioTest: {
      accountSid: 'AC7527c54a4e94b4cf887855d63d55287b',
      authToken: 'b6f938eeabeaca59a58cf18edc6e9def',
   },
   firbaseDatabaseFileName: "luhu-production-firebase-database.json",
   firbaseCredentialsFileName: "serviceAccountKey-production.json",
   users_collection_name: "users",
   offers_collection_name: "offers",
   currency_collection_name: "currency",
   transaction_history_collection_name: "transaction_history",
};

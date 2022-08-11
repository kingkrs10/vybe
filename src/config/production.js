module.exports = {
  relational_db: {
    user: "root",
    host: "localhost",
    database: "merchant",
    password: "",
    port: "26257",
    // cloudpath: "/cloudsql/luhu-dev:us-central1:luhu-development-db-postgres",
    connection_string:
      "postgresql://cari:FsBSC3XWLmApXA1PI9NtBQ@free-tier5.gcp-europe-west1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&options=--cluster%3Dcari-distribution-4855",
  },

  // relational_db: {
  //   host: "35.202.0.126",
  //   port: 5432,
  //   user: "postgres",
  //   pass: "n9Lyi5Eboh1O3KKt",
  //   database: "distribution",
  //   cloudpath: "/cloudsql/luhu-dev:us-central1:luhu-development-db-postgres",
  // },

  app: {
    port: 3333,
    secretKey:
      "YuxhBVW8uv6mxpTeYjJLMtTsiHB5rrkIuoClx8l9/JvsAlvtuZ5w9SAwLUFAvE6DJXjXYsnizg3BKYv/oED37Dy98e5sCNy4JnDhD7tpHdW9xjBkj+i9d1U9Z/U9SKLuU+PqkjtX/Avy8Qq9pHjZ+u9crI+MExwW7WzNgv3dB1CwQM852Dzfk7NBV4PXZ3WqvirnLFy4CoyIspbjMjfNQ/t7/3gXLsVMKqGYVVAws5SxqHcMdP/qiAdFdETAHnyVLrwZL4hB3ke6Xm5Ub5v1En6nzwJiEAxG9OtbcT+LKvnKHMKrS6La+ZstGEyoMiVIJvKInwqkpvQDZOXe2SQhfA==",
  },
  stripe_api_key:
    "sk_test_51HIi1UKuVVSM1kRYQEEPj5OFOR0vGhgGGp7P8NO8o6RwsLe5Mpv7a1c8xyZwTj81Y2GvdNlntTp9FFHas1f3F1Pj00EswMHlps",
  firebaseProjectId: "cari-merchant-dev.appspot.com",
  serviceAccountKey: {
    type: "service_account",
    project_id: "cari-merchant-dev",
    private_key_id: "744e4a5fd4623e00771038554475b419bc775900",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCzfBtDGX9vo1Qq\n6NtVYpQi4r6o7aE575x2CXMj04pFl5FpBb8leGNONffCYneOgheLjGzNcIRzuSf/\nksDiODQ2jio52SaaZXG9fPTeMHPta8ln0BBfGo7BssqPmQ67I0cPvnz3zHSigTMx\naCVDGMNxvrdnV6MLbSi+UEdW4FFYd4T1BrpJLI/wPcoR/g9wR7iIvy03OO1BHv61\nXCT+IW1uPd/AoJnBnfzWCl67SLPT+Xbnv6rjx5IQxiCXGLdnpEGvXFUSa6hNzWmf\ntW9EJc7kzwZKIU6SMzMN8COekBzYadxXHj7myl0dxCVakMPx2SUE/QWtpcPlL1eL\n3oSrcu7xAgMBAAECggEAEKAJzGzTs40O8kyQaHfRneuf2njsarfpp7tXWXWyRKD1\n/KLmIjvlAu0Xzn8dcOtW7/upZlwqQKfhbxhyWmH3YChJ/ALDwyBraTBmZCBb1J2b\n0cxhf9WvbHy5q5RzW104q1orLC7ZjOXnzodFkFH+ZI5UYbOp7BiH4h0AhqkPj+CW\njrTE1VDtGH4Hm/j1AAsHO9AAcc4AmA5UHZ0tB6GKyLY2AlO0klKJHjBeGmsexT5Z\nWw7bMcZmZ3Zq6IQ/9xvIvI/zxLpnHVhfD6cI0MSx2ZYlWx8SNxEcEc+N92joXgqa\nmUg1T0iPUjzd5lYKUikR75Xyqr90V9xYV/A0ooCo2QKBgQDZc7q+VhcRjd2Yu4MV\nKTdtXWRV9aJLhRwfVIowJfjPt13QW1lesvLprdaAnAx6mIJLNeNMJhdLP7IksQhG\nTC4YnXr6hqRa6OUWdhL+v7HnxMY34POuMH1WL7ORqHsKcQhCz9qyUAA32ix6MtRk\nFyXQhg9vLAlOIorcyiN5HprVrQKBgQDTTV7P2yQRSnsCYVDJW+qEh2Iq8/mBnl5A\nDtkj+pE5pw+u4qTgQvogjtkKLcZeSQ+H5+pRbjEk5VPmWhzR3/1eIKylmmI0H4lb\n/xnT0VSQjpYVA+LdKmOk89gV7/kJl5rs7TiEfhU0r6XqqAtKhz+WVumc+Ke8qGdz\nAaOS48R+1QKBgQCg7Fhiy2s+/nHjucEERABU2yyJwMJeiR+KwBGUGEXN0rGGpFO7\nFUtXS+LWQqWphHvIFRUlIXtToMvBA5JQE8h5RvHfvQycioYe3TqpdEvAbYsTh1JO\nsmvPAHYvcTO9QnEOoKwEEdhXfQo1VLCBce/2JX/+keRBAqcpRh6CX/fN8QKBgQCM\n7NQoMtKKSa9itf7IXOo7O4Poe9FTdokLlhuSGGJVHiuiivxFqcXigwMT+9WKOpYG\nIVGwv5o9LknXnxALlaUI6yfaRu3qL4JP/gJ+t+T7iG1mVLIwqT3N3OeoMeVZVWh5\nTflcvC5udhtlNnBZY3ywSwUBsQFGHNbp6BTtOcVqhQKBgEKrbPs7Zv8XPEvpVYi/\nPR30QSd5eZcqGjgpL1No7WL6sNELZhzZNdfPJ7uPJeFUCQ3EeQONCwyWMC6aFLmb\n3ZXaJqMxs/uzOYZ/xN+IEv2bo3bm2gRZ3Yr1Bbia63AUKZnXBhB66syQSJ+RWvT3\nxc5kGeuXlQEQsgfiIy0mMxhC\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-lwqsm@cari-merchant-dev.iam.gserviceaccount.com",
    client_id: "114443609571435768452",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-lwqsm%40cari-merchant-dev.iam.gserviceaccount.com",
  },
  twilioTest: {
    accountSid: "AC7527c54a4e94b4cf887855d63d55287b",
    authToken: "b6f938eeabeaca59a58cf18edc6e9def",
  },
  firbaseDatabaseFileName: "luhu-dev-firebase-database.json",
  firbaseCredentialsFileName: "serviceAccountKey-dev.json",
  users_collection_name: "users",
  offers_collection_name: "offers",
  currency_collection_name: "currency",
  transaction_history_collection_name: "transactionHistory",
};

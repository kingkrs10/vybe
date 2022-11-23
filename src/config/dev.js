module.exports = {
  relational_db: {
    user: "root",
    host: "localhost",
    database: "merchant",
    password: "",
    port: "26257",
    // cloudpath: "/cloudsql/luhu-dev:us-central1:luhu-development-db-postgres",
    connection_string:
      "postgresql://ginidevelopment:sjlt8XRM0ZhOBskuhlMNww@free-tier5.gcp-europe-west1.cockroachlabs.cloud:26257/gini?sslmode=verify-full&options=--cluster%3Dgini-dev-5393",
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
    "sk_test_51M2DUyLlJQFM2ARjMUbU3Q6zhgVdUjD9oTbLu5MKXZ9whP37LqwHTiDmh3oEedsyefEdS8IR7MSpCoCrbm6D0m8I00cAPpHSnj",
  firebaseProjectId: "gini-development.appspot.com",
  serviceAccountKey: {
    type: "service_account",
    project_id: "gini-development",
    private_key_id: "919ec397c824d397cad65466a652a204d084b589",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCilvNRfgWZaUwQ\ncK9sdp1lenP1BUK9P54awheru0G4ExRU1MEHDjDlGRQJgxEkRB2dl+XBGWUn0+tx\nVOxB89GVqCj0SN76BboPj/6ZE7Jf+FU/bDsrEEpo7nMWLHnJQNI1u9P5d0Je4Fsh\nD91g1smP/lc3e0jq9/rgbvfhC9lOaVNI0Kewjf6JeYhYz6sYKnvSRjrwmcualOqU\ncfNg/SXsiviMLZ4GORWoLHBqFb92YKVdWlZWFKgZ8UDzcva/v70T9zopXk275YK5\n5B1VGfj0h4hVrn9z0A29N3rGFXOzCkzf29TUguSNtUDEQRURGZ8UCdJtf3vcjU17\nefP6KLlzAgMBAAECggEAOvNkUX3R5efJzoQs9rSjKPIXLRW1Nwzj9Gu/TWLd1zID\nwyZIvpgknkxTeYduJaoU2tkCUts0VBaAXV0fNGKE8TBBeSEax6hf59ibxUDhAe72\nacKCSYDkmdsrGzURCylXjmgF2YOmKuRJ5ljsOXpnJrBfSxyGObuj2NAjTBORvN3b\nNOanAF52ZYHx9m7s0U7EarsaYsDatU3MJNbXei4vuwQwAZfwOVFKmpViEaOjinTb\neFr0lBYGv1iG7JikmWUjrWQjLn7stA+UJoSyg2ZN5eYla9NSuQShi5GcNmX6qY/8\nREVa/aMC44ruXp6VrFMVpFkrOc7C51VAAZFN+ygIMQKBgQDZtGv/ZZXyM5ReITNB\nfhdqhMNjmpwjN6GcfZ3BPTmcLrojTo/tAZEVylqS879CZiKPqD0zlBj/b5+gwcqP\n/oXgqLaJKrq77gcxuWWwWUdlF8ShOdNrvDwLABKtMWaUedLLRBXeCpEhjapPEUqz\nOnj5ysdYaYtsHaR0bsDIgTIjFwKBgQC/MJxK9jVy69DJgptHUWwlWM6RHaHPBMNT\nZ4iKeK8n0aPPbOQF21WVQNQT0HjdZiruJ9jX3uSCJWGyaR/d3cHPosgFn9/CS741\nh0hlcPF7yspokEQn5ykyNGphdTNq8HISqQHZ4jTPcshSXSFjCQSPOmexYXevPFVC\nChodWrCGBQKBgDtHUmTfj128x7h9x8wcflnFvsI/ViaMvlezKKJ2flpVqt90Q+Jg\nG9ZYHCOJdVmqH90IDWoe+FONXGTUf8iHoIKUzec5mFEVtiXG+rZzCOqw9xyDd1sN\njTfdlDhOjET/ivNIHcAxFmWRgn83ESUOVeSGX5NmYc1VoPMHOT0fWLyPAoGATqWh\ndViojfihb3NRitncodRRTPKikDVGYDXTvhp8+uVK/FWvyxT5tKbxVqFIRtLzT/qG\nQe7Hkx3rfWevGyZQxqgQnfexJQzhVsWqq0f1nlXCQ5cs4jk+Ag/7vtFmcFQuqKxr\nPYTG8psl+nOi+0lHXd/JrfcJM8We0Ma1DWQz/z0CgYEArHOX7BWgIb3BvmqYT1m0\nNbhkDrRfVhDm4QR2g54cLc0aOSB7fYL46l05dDWCtzCuD5ePdCngyjOkEi6o5wCC\nmYgp6iuSfhJRFQ61LDUGQOOx9QQnL8o/1NeS+srZc2As/5v7lm5oCXKfhu74SP9g\n/d5L43aWv65lfjNGfz8DMmU=\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-dw3oz@gini-development.iam.gserviceaccount.com",
    client_id: "105877144529929266369",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dw3oz%40gini-development.iam.gserviceaccount.com",
  },
  twilioTest: {
    accountSid: "AC7527c54a4e94b4cf887855d63d55287b",
    authToken: "b6f938eeabeaca59a58cf18edc6e9def",
  },
  firbaseDatabaseFileName: "luhu-dev-firebase-database.json",
  firbaseCredentialsFileName: "serviceAccountKey-dev.json",
  users_collection_name: "users",
  loans_collection_name: "loans",
  currency_collection_name: "currency",
  transaction_history_collection_name: "transactionHistory",
};

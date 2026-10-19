// MongoDB Initialization Script
// Creates least-privileged application user for forbes_vn database

db = db.getSiblingDB('admin');

// Authenticate as root if needed
// db.auth(process.env.MONGO_INITDB_ROOT_USERNAME, process.env.MONGO_INITDB_ROOT_PASSWORD);

db = db.getSiblingDB('forbes_vn');

db.createUser({
  user: 'forbes_app',
  pwd: 'forbes_app_secure_password_2026',
  roles: [
    {
      role: 'readWrite',
      db: 'forbes_vn',
    },
  ],
});

print("Created application user 'forbes_app' on 'forbes_vn' database with readWrite role.");

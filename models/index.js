const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");
require("dotenv").config();

const basename = path.basename(__filename);

// Build Sequelize instance
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,      // database name
  process.env.ADMIN_USERNAME,     // username
  process.env.ADMIN_PASSWORD,     // password
  {
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: process.env.DIALECT,
    dialectOptions: {
      ssl: { 
        require: true, 
      } // Aiven MySQL requires SSL
    }
  }
);

db.sequelize.sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch(err => {
    console.error("Error syncing database:", err);
  });


const db = {};
db.sequelize = sequelize;

// Load models dynamically
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;

const { Pool } = require('pg');
const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email) {
  const queryString = `
  SELECT * FROM users
  WHERE email = $1;
  `;
  const queryParams = [email];
  return pool.query(queryString, queryParams)
    .then(res => {
      // user not found
      if (!res.rows[0]) return null;
      return res.rows[0];
    })
    .catch(err => console.error('\nerror fetching user:\n', err));
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithId = (id) => {
  return pool.query(`
    SELECT * FROM users
    WHERE id = $1;
  `, [id])
  .then(res => {
    if (res.rows) {
      return res.rows[0];
    } else {
      return null;
    }
  });
}
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  (userObj) => {
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `, [userObj.name, userObj.email, userObj.password])
  .then(res => {
    console.log(`new user: `, res.rows[0]);
    if (res.rows) {
      return res.rows[0];
    } else {
      return null;
    }
  })
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  // return getAllProperties(null, 2);
  return pool.query(`
    SELECT reservations.*, properties.*, AVG(rating) AS average_rating
    FROM reservations
    JOIN properties ON properties.id = reservations.property_id
    JOIN property_reviews ON property_reviews.property_id = reservations.property_id
    WHERE reservations.guest_id = $1
    GROUP BY reservations.id, properties.id
    ORDER BY reservations.start_date LIMIT $2;
  `, [guest_id, limit])
  .then(res => {
    console.log(res.rows);
    if (res.rows) {
      return res.rows;
    } else {
      return null;
    }
  })
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  FULL OUTER JOIN property_reviews ON properties.id = property_id
  `;
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    let operator = '';
    if (options.city) {
      operator = 'AND';
    } else {
      operator = 'WHERE';
    }
    queryString += `${operator} owner_id = $${queryParams.length} `;
  }
  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night);
    let operator = '';
    if (options.city || options.owner_id) {
      operator = 'AND';
    } else {
      operator = 'WHERE';
    }
    queryString += `${operator} cost_per_night > $${queryParams.length} `;
  }
  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night);
    let operator = '';
    if (options.city || options.owner_id || options.minimum_price_per_night) {
      operator = 'AND';
    } else {
      operator = 'WHERE';
    }
    queryString += `${operator} cost_per_night < $${queryParams.length} `;
  }
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `
    GROUP BY properties.id
    HAVING avg(property_reviews.rating) >= $${queryParams.length}
    `;
    queryParams.push(limit);
    queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
  } else {
    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
  }
  return pool.query(queryString, queryParams)
  .then(res => res.rows);
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
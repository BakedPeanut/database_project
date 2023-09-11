const mysql = require('mysql2');
const bcrypt = require('bcrypt');

let userID = null;
// Create a pool with root user first
let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'database_project',
    password: 'admin'
});

// Update the connection with other user after authentication
async function updateConnectionDetails(username, password) {
    const [rows] = await pool.promise().execute('SELECT password, role, id FROM user WHERE username = ?', [username]);

    if (rows.length) {
        const storedPassword = rows[0].password;
        const role = rows[0].role;
        // Check the provided password using bcrypt
        if (await bcrypt.compare(password, storedPassword)) {
            userID = rows[0].id; // Update the userID variable
            console.log('Updated userID:', userID); // Debug statement
            // Create a new pool with provided credentials
            if(role === "ADMIN") {
                pool = mysql.createPool({
                    host: 'localhost',
                    user: 'root',
                    database: 'database_project',
                    password: 'admin'
                });
            } else if (role === "SELLER") {
                pool = mysql.createPool({
                    host: 'localhost',
                    user: 'root',
                    database: 'database_project',
                    password: 'admin'
                });
            } else {
                pool = mysql.createPool({
                    host: 'localhost',
                    user: 'root',
                    database: 'database_project',
                    password: 'admin'
                });   
            }
         
            return role;  // Indicate that connection details were updated successfully
        }
    }
    return null;  // Invalid credentials
}

function getUserID() {
    return userID;
  }
module.exports = {
    pool: pool.promise(),
    updateConnectionDetails,
    getUserID,
    userID
};

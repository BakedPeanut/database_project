// connector/mysql.js
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'database_project',
    password: 'admin'
});

async function updateConnectionDetails(username, password) {
    const [rows] = await pool.promise().execute('SELECT password, role FROM user WHERE username = ?', [username]);

    if (rows.length) {
        const storedPassword = rows[0].password;
        const role = rows[0].role;

        // Check the provided password using bcrypt
        if (await bcrypt.compare(password, storedPassword)) {
            pool.end();
            

            // Create a new pool with provided credentials
            if(role === "ADMIN") {
                pool = mysql.createPool({
                    host: 'localhost',
                    user: "admin",
                    password: "password",
                    database: 'database_project'
                });
            } else if (role === "SELLER") {
                pool = mysql.createPool({
                    host: 'localhost',
                    user: "seller",
                    password: "password",
                    database: 'database_project'
                });
            } else {
                pool = mysql.createPool({
                    host: 'localhost',
                    user: "customer",
                    password: "password",
                    database: 'database_project'
                });   
            }
         
            return role;  // Indicate that connection details were updated successfully
        }
    }
    return null;  // Invalid credentials
}

module.exports = {
    pool: pool.promise(),
    updateConnectionDetails
};

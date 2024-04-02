const mysql =   require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "Social_2",
    waitForConnections: true,
    connectionLimit:10
});

async function getAllUsers(){
    let connection;
    try{
        connection = await pool.getConnection();
        const [rows] = await connection.query("Select * from users");
        return rows;
    }catch (error) {
        console.error("Error get users : ", error);
        throw error;
    }finally{
        if (connection) connection.release();
    }
}


async function createUser(username, password, role){
    try{
        await pool.query("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [username, password, role]);
    }catch (error){
        console.error("Cant create user : ", error)
        throw error;
    }
};

module.exports = {
    getAllUsers,
    createUser
};
const mysql =   require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "Social_2",
    waitForConnections: true,
    connectionLimit:10
});

async function getUsernameById(id){
    let connection;
    try{
        connection = await pool.getConnection();
        const [rows] = await connection.query("Select username from users where id = ? ", [id]);
        return rows[0].username;
    }catch (error){
        console.error("Cant find user: ", error);
        throw error;
    }
}

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
}


async function followUser(followerId, followingId){
    try{
        await pool.query("INSERT INTO follows (followerId, followingId) Values(?, ?)",
        [followerId, followingId]);
    }catch (error){
        console.error("Can't follow : ", error);
        throw error;
    }
}

async function unfollowUser(followerId, followingId){
    try{
        await pool.query("DELETE FROM follows WHERE followerId = ? AND followingId = ?",    
        [followerId, followingId]);
    }catch (error){
        console.error("Cant unfollow user : ", error);
        throw error;
    }
}

async function getFollowers(id){
    const connection =  await pool.getConnection(); 
    const [followers] = await connection.query("SELECT username FROM users WHERE id IN (SELECT followerId FROM follows WHERE followingId = ?)", [id]);
    return followers;
}

async function getFollowings(id){
    const connection = await pool.getConnection();
    const [followings] = await connection.query("SELECT username, id FROM users WHERe id IN (SELECT followingId FROM follows WHERE followerId = ?)", [id]);
    return followings;
}


module.exports = {
    getAllUsers,
    createUser,
    followUser,
    unfollowUser,
    getUsernameById,
    getFollowers,
    getFollowings    
};
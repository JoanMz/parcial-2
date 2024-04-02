// usersController.js

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const userModel = require('../Models/userModel');
const userModelT = require("../Models/userModelT");

router.use(bodyParser.json());

// Ruta para crear un nuevo usuario
router.post('/', (req, res) => {
  const { username, password,  role } = req.body;
  userModel.createUser(username, password,  role, (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error creating user' , error: err});
    }
    res.json({ success: true, user });
  });
});

// Ruta para autenticar un usuario
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  userModel.authenticateUser(username, password, (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error authenticating user' });
    }
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    res.json({ success: true, user });
  });
});

// Ruta para obtener todos los usuarios
router.get('/', (req, res) => {
  userModel.getAllUsers((err, users) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error getting users' });
    }
    res.json({ success: true, users });
  });
});

// Ruta para seguir a un usuario
router.post('/follow', (req, res) => {
  const { followerId, followingId } = req.body;
  userModel.followUser(followerId, followingId, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error following user' });
    }
    res.json({ success: true, message: 'User followed successfully', data: result });
  });
});

// Ruta para dejar de seguir a un usuario
router.delete('/unfollow', (req, res) => {
  const { followerId, followingId } = req.body;
  userModel.unfollowUser(followerId, followingId, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error unfollowing user' });
    }
    res.json({ success: true, message: 'User unfollowed successfully', data: result });
  });
});


router.get("/Test", async (req, res) => {
  const users = await userModelT.getAllUsers();
  res.json(users);
});

router.post("/Test", async (req, res) => {
  const {username, password, role} = req.body;
  await userModelT.createUser(username, password, role);
  res.json({message:"Created correctly"})
});

router.post("/Tfollow", async (req, res) => {
  const {followerId, followingId} = req.body;
  await userModelT.followUser(followerId, followingId);
  let username = await userModelT.getUsernameById(followingId);
  res.json({message:`follow ${username}`});
});


router.delete("/Tunfollow", async (req, res) => {
  try {
  const {followerId, followingId} = req.body;
  await userModelT.unfollowUser(followerId, followingId);
  }catch (error){
    console.error("Cant unfollow : ", error);
    throw error;
  }

  res.json({succes:true, message: "User Unfollow succesfull"});
});

router.get("/Tfollowers/:id", async (req, res) =>{
  const id = req.params.id;
  const followers = await userModelT.getFollowers(id);
  //console.log(id)
  res.json(followers);
});

router.get("/Tfollowings/:id", async (req, res) => {
  const id = req.params.id;
  const following = await userModelT.getFollowings(id);
  res.json(following);
})

module.exports = router;


const users = require('../models/user');
const bcrypt = require("bcryptjs");

const findAllUsers = async (req, res, next) => {
  req.usersArray = await users.find({}, {password: 0 });
  next();
}

const hashPassword = async (req, res, next) =>{
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;
    next();
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(JSON.stringify({message: "Ошибка хеширования пароля"}));
  }
};

const findUserById = async (req,res,next)=>{
  try{
    req.user = await users.findById(req.params.id, { password: 0 });
    next();
  } catch(error){
    res.setHeader("Content-Type", "application/json");
    res.status(404).send(JSON.stringify({message: "Пользователь не найден"}));
  }
};

const createUser = async (req, res, next) =>{
  console.log("POST /users")
  try{
    console.log(req.body);
    req.user = await users.create(req.body);
    next();
  } catch (error){
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(JSON.stringify({message: "Ошибка создания пользователя"}));
  }
};

const updateUser = async (req, res, next)=>{
  try{
    req.user = await users.findByIdAndUpdate(req.params.id, req.body);
    next();
  } catch(error){
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(JSON.stringify({message:"Ошибка обновления пользователя"}));
  }
};

const deleteUser = async(req,res,next)=>{
  try{
    req.user= await users.findByIdAndDelete(req.params.id);
    next();
  }catch(error){
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(JSON.stringify({message:"Ошибка удаления пользователя"}));
  }
};

const checkEmptyNameAndEmailAndPassword = async(req, res, next) =>{
  if(!req.body.username || !req.body.email || !req.body.password){
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(JSON.stringify({message:"Поля заполни быстро"}));
  } else {
    next();
  }
};

const checkEmptyNameAndEmail = (req, res, next) => {
  if(!req.body.username || !req.body.email){
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(JSON.stringify({message:"Почему есть пустота!!!!!????"}));
  } else{
    next();
  }
}

const checkIsUserExists = async (req, res, next) => {
  const isInArray = req.usersArray.find((user) => {
    return req.body.usersname === user.username;
  });
  if (isInArray) {
    res.setHeader("Content-Type", "application/json");
        res.status(400).send(JSON.stringify({ message: "Пользователь с таким именем уже существует" }));
  } else {
    next();
  }
};


module.exports = {
  findAllUsers, 
  createUser, 
  findUserById, 
  updateUser,
  deleteUser,
  checkEmptyNameAndEmailAndPassword,
  checkEmptyNameAndEmail,
  hashPassword,
  checkIsUserExists
}; 

const userModel = require('../../models/user.js')
const db = require('../../models/index')



//createUser 
const createUser = async function(req, res){

    try{
        const requestBody = req.body

        const {name, age, email, gender } = requestBody
        console.log(requestBody)

        let userExist = await db.sequelize.models.user.findOne({where:{name},})
        console.log({userExist});
        if(userExist) 
         {
            return res.status(400).send({status:false, message:"User Already exist"})

        }

        let newUser = await db.sequelize.models.user.create({name, age, email, gender});
        return res.status(201).send({status:true, message:"User created successfully", data:newUser});


    }
    catch(err){

        return res.status(500).send({status:false, message: err.message})



    }
}



//getuser by id
const getUserById = async function(req, res){

    try{

        const id = req.params.id
        console.log(id)

        const userById = await db.sequelize.models.user.findOne({where:{id,},});
        console.log(userById)
        return res.status(200).send({status:true, message:"User created successfully", data:userById});

   

    }
    catch(error){

        res.status(500).send({status:false, message:error.message})
    }
}

//UpdateUser
const updateUser = async function(req, res){
    try{

        const{name, age, email, gender } = req.body
        const id = req.params.id

        if(name)
        {
            db.sequelize.models.user.name = name
        }

        if(age)
        {
            db.sequelize.models.user.age = age
        }

        if(email)
        {
            db.sequelize.models.user.email = email
        }
        if(gender)
        {
            db.sequelize.models.user.gender = gender
        }

        const update = await db.sequelize.models.user.findOne({
            where: {
              id,
            },
          });

        const updatedUser = await update.update({name, age, email, gender})

        return res.status(200).send({status:true, message:"User updated!", data:updatedUser})


    }
    catch(error){

        res.status(500).send({status:false, message:error.message})
 
    }
}



//deleteUser
const deleteUser = async function (req, res){
    try{

        const id = req.params.id;

        const userToDelete = await db.sequelize.models.user.findOne({
            where: {
              id,
            },
          });

        const deletedUser = userToDelete.destroy()

        res.status(200).send({status:true, message:"User has been deleted successfully", data:deletedUser})

    }
    catch(error){
        res.status(500).send({status:false, message:error.message})
 
    }
}

module.exports = {getUserById, createUser, updateUser, deleteUser}

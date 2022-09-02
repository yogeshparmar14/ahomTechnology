const userModel=require("../../db/models/registerSchema.js")
const bcrypt = require('bcrypt');

const registration = async (req,res)=>{
    const {name,phone,email,password,termCondition,userType} = req.body
    const user = await userModel.findOne({email})
    if(user) return res.status(403).send({
        data: {},
        error: {
           email: "Email is already registered email"
        }
        })
    if(!name||!phone||!email||!password||!termCondition)
        return res.status(403).send({
            data: {},
            error: {
               email: "Email is required",
               phone:"Phone is required",
               password: "Password is required",
               termCondition:"TermCondition is required"
            
            }
            })     
                try {
                
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(password,salt)
                    const doc = new userModel({
                        name:name,
                        email:email,
                        phone:phone,
                        password:hashPassword,
                        termCondition:termCondition,
                        userType:userType
                    })
                    await doc.save()
                    const savedUser = await userModel.findOne({email})
                    res.send({"message":"Signup successfully!", "status":200,
                    "data":{
                        "_id":savedUser._id,
                        "name":savedUser.name,
                        "email":savedUser.email,
                        }
                    })
                 } catch (error) {
                     console.log(error)
                     res.status(403).send({
                        data: {},
                        error: {
                           message: "unable to signup"
                        
                        }
                        })
                 
               
               }
            }

const login = async(req,res)=>{
  
        const {email,password} = req.body
            if(!email||!password)
               return res.status(403).send({
                data: {},
                error: {
                   email: "Email is required",
                   password: "Password is required",
                
                }
                })
            const user = await userModel.findOne({email:email})
            if(user == null)
               return res.status(403).send({
                data: {},
                error: {
                   email: "please enter registered email",
                   password: "please enter register password",
                
                }
                })
            const isMatch = await bcrypt.compare(password,user.password)
            if((user.email != email) || !isMatch)
              { return res.status(403).send({
                data: {},
                error: {
                   email: "please enter registered email",
                   password: "please enter register password",
                
                }
                })}
            try {
                    res.status(200).send({"message":"Login sucess","status":200,
                    "data":{
                        "_id":user._id,
                        "name":user.name,
                        "email":user.email,
                        }})
                } catch (error) {
                    console.log(error)
                }
            }

module.exports = { registration,login };

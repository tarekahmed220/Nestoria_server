import joi from 'joi'
const userValidationSchema=joi.object({
    fullName:joi.string().min(3).max(30).required(),
    email:joi.string().email().required().lowercase(), 
    password:joi.string().min(8).max(50).required().pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[\\*\\@\\%\\$\\#]).{8,30}$')),
    passwordConfirm:joi.string().min(8).max(50).required().pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[\\*\\@\\%\\$\\#]).{8,30}$')),
    role:joi.string().required(),
    address:joi.string().min(3).max(30).required(),
    phone:joi.string().min(9).max(50).required(),


})
const userLogIn=joi.object({
    email:joi.string().email().required(),
    password:joi.string().min(8).max(50).required().pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[\\*\\@\\%\\$\\#]).{8,30}$')),
    
})
export{ userValidationSchema,userLogIn}
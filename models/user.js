var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var userSchema=new Schema({
    _id:Schema.Types.ObjectId,
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        default:""
    },
    role:{
        type:String,
        required:true,
        enum:['Admin','Commuity Manager','User'],
        default:'User'
    },
    status:{
        type:Boolean,
        default:false,
        required:true
    },
    activated:{
        type:Boolean,
        default:true,
        required:true
    },
    gender:{
        type:String,
        default:'Male',
        enum:['Male','Female','Transgender']
    },
    dob:{
        type:Date,
    },
    phone:{
        type:Number
    },
    city:{
        type:String
    },
    image:{
        type:String
    },
    interests:[
        {type:String}
    ],
    journey:{
        type:String
    },
    expectation:{
        type:String
    },

    /*
    
    tags:[
        {type:String}
    ],//it may be same as interests

    //link with communities also
    //array of communities created,member,requested,

    created:{
        type:Date,
        default:Date.now
    },
    */


});

var User=mongoose.model('User',userSchema);

module.exports=User;

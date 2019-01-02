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
        type:String
    },
    role:{
        type:String,
        required:true,
        enum:['Admin','Commuity Manager','User'],
        default:'User'
    },
    status:{
        type:Boolean,
        default:true,
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
        default:Date.now
    },
    phone:{
        type:number

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
    tags:[
        {type:String}
    ],

    /*
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

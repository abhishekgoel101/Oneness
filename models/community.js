var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var communitySchema=new Schema({

    _id:Schema.Types.ObjectId,
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        required:true
    },
    rule:{
        type:String,
        enum:['Direct','Permission'],
        default:'Direct',
        required:true
    },
    activated:{
        type:Boolean,
        default:true,
        required:true
    },
    image:{
        type:String
    },
    created:{
        type:Date,
        default:Date.now,
        required:true
    },
    location:{
        type:String
    },
    

    /*
    group admin array,
    user array,invited user array,requests to join user array
    tags:[
        {type:String}
    ],

    // discussions part-a post array having having posted by,date,tags,
    // description,featured yes or no,global(publish)yes or no,
    // each post element having comments array which further has 
    // a reply array 

    */

});

var Community=mongoose.model('Community',communitySchema);

module.exports=Community;


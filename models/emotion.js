const mongoose = require('mongoose');
var  Schema = mongoose.Schema;


const Emotion = new mongoose.Schema(
    { 
        ondate:{
          type: Date,
          default: Date.now
        },
        mood:{
          type:String,
          required:true
        },
        desc:{
          type:String
        }
    
    }

)



// const Emotion = mongoose.model('Emotion', EmotionSchema);

module.exports = Emotion;

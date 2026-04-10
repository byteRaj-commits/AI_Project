import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
{
  conversationId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Conversation"
  },

  role:String,
  content:String
},
{timestamps:true}
);

export default mongoose.model("Message",messageSchema);
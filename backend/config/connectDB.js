const mongoose=require("mongoose")

const connectDb=(uri)=>{
    mongoose.set("strictQuery",false)
    mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },err=>{
    if (err) throw err;
     console.log("MongoDB connection established...")
  })
}

module.exports=connectDb
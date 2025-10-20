import app from "./src/app.js";
import connectDB from "./src/db/db.js";
import {connect} from "./src/broker/rabbit.js";



async function start(){
  try{
    await connectDB();
    // connect to RabbitMQ but don't let it block server startup
    connect().catch(err => console.error('RabbitMQ connect failed (non-fatal):', err));

    app.listen(3000, () => {
      console.log("✅ Auth server is running on port 3000");
    })
  }catch(err){
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

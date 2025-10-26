import app from "./src/app.js";
import connectDB from "./src/db/db.js";
import {connect} from "./src/broker/rabbit.js";


const PORT = process.env.PORT || 3000;
async function start(){
  try{
    await connectDB();
    // connect to RabbitMQ but don't let it block server startup
    connect().catch(err => console.error('RabbitMQ connect failed (non-fatal):', err));

    app.listen(PORT, () => {
      console.log(`✅ Auth server is running on port ${PORT}`);
    })
  }catch(err){
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

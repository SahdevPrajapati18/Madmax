import app from "./src/app.js";
import connectDB from "./src/db/db.js";
import {connect} from "./src/broker/rabbit.js";



connectDB();
connect();

app.listen(3000, () => {
  console.log("✅ Auth server is running on port 3000");
})

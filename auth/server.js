import app from "./src/app.js";
import connectDB from "./src/db/db.js";

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("✅ Auth server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("❌ Server not started due to DB error:", err);
  });

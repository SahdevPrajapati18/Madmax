import app from './src/app.js';
import connectDB from './src/db/db.js';

connectDB();
const PORT=process.env.PORT || 3002;
app.listen(PORT,"0.0.0.0",()=>{
    console.log(`Server is running on port ${PORT}`);
})
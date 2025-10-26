import app from './src/app.js';
import {connect} from './src/broker/rabbit.js';
import startListener from './src/broker/listener.js';


connect().then(startListener)

const PORT=process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
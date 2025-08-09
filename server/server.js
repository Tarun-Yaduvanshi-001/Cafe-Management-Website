import app from './app.js' ;
import config from './config/config.js';

app.listen(config.app.PORT, ()=>{
    console.log(`server is running on ${config.app.PORT}`)
})
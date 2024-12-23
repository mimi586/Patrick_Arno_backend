import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
 

import { userRoute } from './components/user/add_user.js';
import { update_userRoute } from './components/user/update_user.js';
import { delete_userRoute } from './components/user/delete_user.js';
import { affiche_userRoute } from './components/user/fetch_user.js';
import { impotsRoute } from './components/Impots/Add_impots.js';
import { delete_impotsRoute } from './components/Impots/Delete_impots.js';
import { Affiche_impotsRoute } from './components/Impots/Fetch_impots.js';
import { Update_impotsRoute } from './components/Impots/Update_impots.js';
 import { loginRoute } from './components/login.js';

const app = express();
const PORT = 8081;

app.use(bodyParser.json());
app.use(cors());

app.use('/add_user', userRoute);
app.use('/fetch_user', affiche_userRoute);
app.use('/update_user', update_userRoute);
app.use('/delete_user', delete_userRoute);
app.use('/add_imp', impotsRoute );
app.use('/delete_imp', delete_impotsRoute);
app.use( '/fetch_imp', Affiche_impotsRoute);
app.use('/update_imp', Update_impotsRoute );
 
app.use('/login', loginRoute);




app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`Connected to MySql database`);
});

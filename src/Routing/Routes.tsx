import { FC } from "react";
import { Route, Router } from 'react-router-dom';
import { HomeAdmin } from "../ElectronicsShop/Components/HomeAdmin";
import { HomeUser } from "../ElectronicsShop/Components/HomeUser";
import { SignIn } from "../ElectronicsShop/Components/SignIn";
import { SignUp } from "../ElectronicsShop/Components/SignUp";
import { JWT } from "../ElectronicsShop/Models/JWT";
import { UserRole } from "../ElectronicsShop/Service/Helpers/EnumRole";
import history from './History';

export const Routes: FC = () => {
    const Home=  (<Route path="/"exact component={ SignIn}/>);
             
    const user:JWT=JSON.parse(localStorage.getItem('jwtDecoded')??'');
    return (
        <Router history={history}>
             {user.role===UserRole.Admin?(
             <Route path="/HomeAdmin"exact component={HomeAdmin}/>):(Home)}
             {user.role===UserRole.User?(
             <Route path="/HomeUser"exact component={HomeUser}/>):(Home)}
             <Route path="/Signup"exact component={SignUp}/>
                              
            </Router>
    );
};

export default Routes;
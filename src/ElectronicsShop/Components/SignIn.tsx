import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { UIHelpers } from '../../helpers/UIHelpers';
import { RedirectTO } from '../../Routing';
import { ServiceCreator } from '../Service/client';
import { LoginDto } from '../Service/proxy';
import '../Styles/SignIn.css';
import jwt from 'jwt-decode' // import dependency
import { JWT } from '../Models/JWT';

interface OwnProps {
}

  export const SignIn: React.FC<OwnProps> = ( props: OwnProps) => {
    const {t} = useTranslation(['ElectronicShop']);
   const [errorMessage,setErrorMessage] = useState<string>();
  const [token,SetToken] = useState<string>();
  const [email,SetEmail] = useState<string>();
  const [password,SetPassword] = useState<string>(); 
 
  const SignIn = async () => {
      try {
         debugger;
          const client = ServiceCreator.getElectronicsShopClient();
          const requestDto=new LoginDto ();
          requestDto.email=email;
          requestDto.password=password;
         const response= await client.login(requestDto);
         SetToken(response);
         const user:JWT = jwt(response); 
         user.access_token=response;
         localStorage.setItem('jwt', response);
         localStorage.setItem('jwtDecoded', JSON.stringify(user) );
       
         if(user?.role==='Admin')
         RedirectTO('/HomeAdmin');
         if(user?.role==='User')
         RedirectTO('/HomeUser');
      } catch (ex) {
          const Err=UIHelpers.GetError(ex);
          const ErrMsg=
                       Err?.BusinessErrors??
                       Err?.ExceptionMessage??'';
                       setErrorMessage(ErrMsg);
      }
  }; 
  return (
     <div className='SigninContainer'>
       <main className="form-signin w-100 m-auto">
    <form>
      <h1 className="h3 mb-3 fw-normal">{t('LoginTitle')}</h1>
  
      <div className="form-floating">
        <input value={email} onChange={(value)=>{SetEmail(value.target.value);}} type="email" className="form-control" id="floatingInput" placeholder="name@example.com"/>
        <label htmlFor="floatingInput">{t('Email')}</label>
      </div>
      <div className="form-floating">
        <input value={password} onChange={(value)=>{SetPassword(value.target.value);}} type="password" className="form-control" id="floatingPassword" placeholder="Password"/>
        <label htmlFor="floatingPassword">{t('Password')}</label>
      </div>
  
      <div className="checkbox mb-3">
      <Link to="/Signup">{t('Register')}</Link>
      </div>
      <input  onClick={()=>{SignIn();}} className="w-100 btn btn-lg btn-primary" type="button" value={t('submit')}/>
    </form>
  </main>
     </div>
  );
}
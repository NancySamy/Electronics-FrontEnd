

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UIHelpers } from '../../helpers/UIHelpers';
import { RedirectTO } from '../../Routing';
import { ServiceCreator } from '../Service/client';
import { RegisterRequestDto } from '../Service/proxy';


interface OwnProps {
}

  export const SignUp: React.FC<OwnProps> = ( props: OwnProps) => {
    const {t} = useTranslation(['ElectronicShop']);
   const [errorMessage,setErrorMessage] = useState<string>();
    const [email,SetEmail] = useState<string>();
    const [password,SetPassword] = useState<string>(); 
    const [address,Setaddress] = useState<string>(); 
    const [birthDate,SetbirthDate] = useState<string>(); 
    const [phoneNumber,SetphoneNumber] = useState<string>(); 
    const [userName,SetuserName] = useState<string>(); 
    const [userId,SetuserId] = useState<number>(); 
    const SignUp = async () => {
      try {
         debugger;
          const client = ServiceCreator.getElectronicsShopClient();
          const requestDto=new RegisterRequestDto ();
          requestDto.email=email;
          requestDto.password=password;
          requestDto.address=address;
          requestDto.birthDate=birthDate;
          requestDto.phoneNumber=phoneNumber;
          requestDto.userName=userName;
         const response= await client.registration(requestDto);
         SetuserId(response);

         RedirectTO('/');
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
      <h1 className="h3 mb-3 fw-normal">{t('SignUpTitle')}</h1>
      <div className="form-floating">
        <input  required value={userName} onChange={(value)=>{SetuserName(value.target.value);}} type="text" className="form-control" id="floatingInput"/>
        <label htmlFor="floatingInput">{t('UserName')}</label>
      </div>
      <div className="form-floating">
        <input  required value={email} onChange={(value)=>{SetEmail(value.target.value);}} type="email" className="form-control" id="floatingInput" placeholder="name@example.com"/>
        <label htmlFor="floatingInput">{t('Email')}</label>
      </div>
      <div className="form-floating">
        <input required value={address} onChange={(value)=>{Setaddress(value.target.value);}} type="text" className="form-control" id="floatingInput" />
        <label htmlFor="floatingInput">{t('address')}</label>
      </div>
      <div className="form-floating">
        <input required value={phoneNumber} onChange={(value)=>{SetphoneNumber(value.target.value);}} type="text" className="form-control" id="floatingInput" />
        <label htmlFor="floatingInput">{t('phoneNumber')}</label>
      </div>
      <div className="form-floating">
        <input required value={birthDate} onChange={(value)=>{SetbirthDate(value.target.value);}} type="date" className="form-control" id="floatingInput" />
        <label htmlFor="floatingInput">{t('birthDate')}</label>
      </div>
      <div className="form-floating">
        <input required value={password} onChange={(value)=>{SetPassword(value.target.value);}} type="password" className="form-control" id="floatingPassword" placeholder="Password"/>
        <label htmlFor="floatingPassword">{t('Password')}</label>
      </div>
  
      <input  onClick={()=>{debugger; SignUp();}} className="w-100 btn btn-lg btn-primary" type="button" value={t('submit')}/>
    </form>
  </main>
     </div>
  );
}
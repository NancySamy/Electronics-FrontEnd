/* eslint-disable jsx-a11y/anchor-is-valid */

import {IDropdownOption,Stack, IStackTokens} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
interface OwnProps {
}

   const Translation: React.FC<OwnProps> = ( props: OwnProps) => {
    const { i18n,t } = useTranslation(['ElectronicShop']);
    const stackTokens: IStackTokens = { childrenGap: 20 };
    
    const lngs:IDropdownOption[] = [{key:'en',text:t("English")},{key:'ar',text:t("Arabic")}];

  return (
    <Stack tokens={stackTokens}>
    
  <div className="dropdown">
  <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
{t('Language')}
  </a>

  <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
  {lngs.map((lng) => (
    <li><a className="dropdown-item" href="#" key={lng.key}  onClick={() => i18n.changeLanguage(lng.key?.toString()??'en')}>{lng.text}</a></li>

          ))}

  </ul>
</div>
       </Stack>
      
  );
}

export default Translation;
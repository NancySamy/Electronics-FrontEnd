/* eslint-disable react-hooks/exhaustive-deps */
import { IDropdownOption } from '@fluentui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UIHelpers } from '../../helpers/UIHelpers';
import { ServiceCreator } from '../Service/client';
import { ProductsDto } from '../Service/proxy';
import AddProductDialog from './AddProductDialog';
import  '../Styles/HomeAdmin.css';

interface OwnProps {
}

  export const HomeAdmin: React.FC<OwnProps> = ( props: OwnProps) => {
    const {t} = useTranslation(['ElectronicShop']);
    const [Products,SetAllProducts]=useState<ProductsDto[] | undefined>();
    const [error,setErrorMessage]=useState<string>();
    const [ShowAddProductDialog,setShowAddProductDialog]=useState<boolean>(false);
    const [reload,setReload]=useState<boolean>(true);
    const [CategoriesLookups, setCategoriesLookups] = useState<IDropdownOption[]>([]);
    
    const GetProducts = async () => {
      try {
         debugger;
          const client = ServiceCreator.getElectronicsShopClient();
         const response= await client.getAllProducts();
         SetAllProducts(response.products??[]);
      } catch (ex) {
          const Err=UIHelpers.GetError(ex);
          const ErrMsg=
                       Err?.BusinessErrors??
                       Err?.ExceptionMessage??'';
                       setErrorMessage(ErrMsg);
      }
  }; 

  const GetCategories = async () => {
    try {
    debugger;
        const client = ServiceCreator.getElectronicsShopClient();
    const response= await client.getAllCategories();
    const arr =
    response.categories?.map<IDropdownOption>((c) => ({
        key: c?.id ?? 0,
        text: UIHelpers.GetLocalized(c.nameEn,c.nameAr)?? '',
        data: c?.code ?? ''
    })) ?? [];
     setCategoriesLookups(arr??[]);
     console.log(arr);
    } catch (ex) {
        const Err=UIHelpers.GetError(ex);
        const ErrMsg=
                    Err?.BusinessErrors??
                    Err?.ExceptionMessage??'';
                    setErrorMessage(ErrMsg);
    }
  }; 

  useEffect(() => {
    GetCategories();
    if(reload)
    GetProducts();
    setReload(false);
    }, [GetCategories,GetProducts,reload]);

  return (
    < div className='HomeAdminContainer'>

        <input type='button' className="btn btn-primary" value={t('AddProduct')} 
        
        onClick={()=>{
           if( (CategoriesLookups.length??0)>0)
            setShowAddProductDialog(true);
            else
            setShowAddProductDialog(false);
            }}/>
      
        {(Products?.length??0)>0&&(
            <table className="table">
            <thead>
                <tr>
                <th scope="col">{t('ProductName')}</th>
                <th scope="col">{t('ProductDesc')}</th>
                <th scope="col">{t('ProductPrice')}</th>
                <th scope="col">{t('Quantity')}</th>
                <th scope="col">{t('DiscountPercentage')}</th>

                </tr>
            </thead>
            <tbody>
                {
                    Products?.map((product,index) => {
                        return (
                        <tr>
                            <td>{UIHelpers.GetLocalized(product.nameEn,product.nameAr)}</td>
                            <td>{UIHelpers.GetLocalized(product.descEn,product.descAr)}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>{product.discountPercentage}</td>
                            
                        </tr>)
                    })
                }

            

            </tbody>
            </table>
            )}
      {(ShowAddProductDialog&& (CategoriesLookups.length??0)>0)&&(
        <AddProductDialog 
        CategoriesLookups={CategoriesLookups??[]}
        hidden={!ShowAddProductDialog}
        onClose={()=>{setShowAddProductDialog(false); }}
        onSave={(response)=>{ setShowAddProductDialog(false); setReload(true)}}
          />
      )}
    </div>
  );
}



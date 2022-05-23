

import { PrimaryButton, TextField } from '@fluentui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UIHelpers } from '../../helpers/UIHelpers';
import { ServiceCreator } from '../Service/client';
import { AddOrderRequestDto, OrderRequestDto, ProductsDto } from '../Service/proxy';
import '../Styles/HomeUser.css';
import { JWT } from '../Models/JWT';

export class CustomProductDto {
    nameAr: string | undefined;
    nameEn: string | undefined;
    descAr: string | undefined;
    descEn: string | undefined;
   
    price: number | undefined;
   
    categoryId: number | undefined;
   
    Id: number | undefined;
    
    discountPercentage: number | undefined;
    
    quantity: number | undefined;
    Userquantity: number | undefined;

    checked?: boolean;

    disabled?: boolean;

    hidden?: boolean;

}

interface OwnProps {
}

  export const HomeUser: React.FC<OwnProps> = ( props: OwnProps) => {
    const {t} = useTranslation(['ElectronicShop']);
    const [Products,SetAllProducts]=useState<ProductsDto[] | undefined>();
    const [ProductsArray,SetProductsArray]=useState<CustomProductDto[]>([]);
    const [error,setErrorMessage]=useState<string>();
    const [reload,setReload]=useState<boolean>(true);
    const MapFromOriginalToCustom = (claimsOriginal: ProductsDto[]): CustomProductDto[] => {
        const res: CustomProductDto[] = [];

        claimsOriginal.forEach(item => {
            const CustomItem: CustomProductDto = new CustomProductDto();
            CustomItem.Id = item.Id;
            CustomItem.checked = false;
            CustomItem.nameAr = item.nameAr;
            CustomItem.nameAr = item.nameAr;
            CustomItem.nameEn = item.nameEn;
            CustomItem.descAr = item.descAr;
            CustomItem.descEn = item.descEn;
            CustomItem.categoryId = item.categoryId;
            CustomItem.discountPercentage = item.discountPercentage;
            CustomItem.quantity = item.quantity;
            CustomItem.Userquantity = 0;
            CustomItem.price = item.price;

            res.push(CustomItem);
        });

        return res.sort((a, b) => (a.Id ?? 0) - (b.Id ?? 0));
    };
    const SetCustomPermession = (userproduct: CustomProductDto, CheckValue: boolean) => {
        debugger;
        const originalItem = ProductsArray?.find(x => x.Id === Number(userproduct.Id));
        if (originalItem) {
            const newItem = originalItem;
            newItem.checked = CheckValue;
            const index1 = ProductsArray?.indexOf(originalItem);
            const newItems = ProductsArray?.slice();
            newItems[index1] = { ...originalItem, ...newItem };
            SetProductsArray([...newItems]);
        }

    };
    const SetCustomPermessionQuantity = (userproduct: CustomProductDto, UserQuantity: number) => {
        debugger;
        const originalItem = ProductsArray?.find(x => x.Id === Number(userproduct.Id));
        if (originalItem) {
            const newItem = originalItem;
            newItem.Userquantity = UserQuantity;
            const index1 = ProductsArray?.indexOf(originalItem);
            const newItems = ProductsArray?.slice();
            newItems[index1] = { ...originalItem, ...newItem };
            SetProductsArray([...newItems]);
        }

    };
    const  MapfromCustomToDto=(arg0: CustomProductDto[]): OrderRequestDto[] | undefined=> {
        const res: OrderRequestDto[] = [];
    
        arg0.forEach(item => {
            const CustomItem: OrderRequestDto = new OrderRequestDto();
            CustomItem.productID = item.Id??0;
            CustomItem.quantity = item.Userquantity??0;
            res.push(CustomItem);
        });
    
        return res.sort((a, b) => (a.productID ?? 0) - (b.productID ?? 0));
    };
    const createOrder = async () => {
      try {
         debugger;
          const client = ServiceCreator.getElectronicsShopClient();
         const requestDto=new AddOrderRequestDto();
         requestDto.orderProducts=MapfromCustomToDto(ProductsArray.filter(p=>p.checked&&(p.Userquantity??0)>0)??[]);
const user:JWT=JSON.parse(localStorage.getItem('jwtDecoded')??'');
requestDto.userID=Number(user.Id);
const response= await client.addOrder(requestDto);

      } catch (ex) {
          const Err=UIHelpers.GetError(ex);
          const ErrMsg=
                       Err?.BusinessErrors??
                       Err?.ExceptionMessage??'';
                       setErrorMessage(ErrMsg);
      }
    }; 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const GetProducts = async () => {
      try {
         debugger;
          const client = ServiceCreator.getElectronicsShopClient();
         const response= await client.getAllProducts();
         SetAllProducts(response.products??[]);
         SetProductsArray(MapFromOriginalToCustom(response.products??[]));
      } catch (ex) {
          const Err=UIHelpers.GetError(ex);
          const ErrMsg=
                       Err?.BusinessErrors??
                       Err?.ExceptionMessage??'';
                       setErrorMessage(ErrMsg);
      }
    };

    useEffect(() => {
    if(reload)
    GetProducts();
    setReload(false);
    }, [GetProducts, reload]);



  return (
      < div className='HomeUserContainer'>
            {(Products?.length??0)>0&&(
            <table className="table">
            <thead>
                <tr>
                <th scope="col"/>
                <th scope="col">{t('ProductName')}</th>
                <th scope="col">{t('ProductDesc')}</th>
                <th scope="col">{t('ProductPrice')}</th>
                <th scope="col">{t('Quantity')}</th>
                <th scope="col">{t('DiscountPercentage')}</th>
                <th scope="col">{t('UserQuantity')}</th>

                </tr>
            </thead>
            <tbody>
                {
                    ProductsArray?.map((product,index) => {
                        return (
                        <tr>
                            <td><input type="checkbox" checked={product.checked} onChange={(val)=>{SetCustomPermession(ProductsArray[index],val.currentTarget.checked);}} id={"html"+product.Id} name={"fav_language"+product.Id}/></td>
                            <td>{UIHelpers.GetLocalized(product.nameEn,product.nameAr)}</td>
                            <td>{UIHelpers.GetLocalized(product.descEn,product.descAr)}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>{product.discountPercentage}</td>
                            {ProductsArray[index].checked&&( <TextField
                                            required
                                            type='number'
                                            value={product.Userquantity?.toString() ?? ''}
                                            max={product.quantity}
                                            onChange={(_, val) => {  SetCustomPermessionQuantity(ProductsArray[index],Number(val));}}
                                        />)}
                        </tr>)
                    })
                }

            

            </tbody>
            </table>
            )}
                <PrimaryButton
                    className='save'
                    menuIconProps={ { iconName: 'Add' } }
                    disabled={(ProductsArray.filter(p=>p.checked&&(p.Userquantity??0)>0)?.length??0)===0}
                    text={ t('Buy')}
                    onClick={() => {createOrder(); setReload(true);}}

                />
     </div>
  );
}





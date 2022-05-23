/* eslint-disable no-unused-expressions */
/* eslint-disable react/require-default-props */
import { IDropdownOption, PrimaryButton, MessageBarType, TextField, Dialog, MessageBar, Dropdown, IDropdownStyles, } from '@fluentui/react';
import { FC, Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceCreator } from '../Service/client';
import { AddProductRequestDto } from '../Service/proxy';
import { UIHelpers } from '../../helpers/UIHelpers';
export enum Fields{
    NameAr='NameAr',
    NameEn='NameEn',
    DescAr='DescAr',
    DescEn='DescEn',
    Price='Price',
    Quantity='Quantity',
    All='All',
};
export enum InputType {
    None,
    Number,
    DecimalNumber,
    LetterOnly,
  }
  
export interface Props {
    CategoriesLookups: IDropdownOption[]
    hidden: boolean;
    onClose: () => void;
    onSave: (response:any|undefined) => void;
}
const AddProductDialog: FC< Props> = (props: Props) => {
    const {CategoriesLookups, hidden, onClose, onSave } = props;
    const { t } = useTranslation(['ElectronicShop']);
    const [error, setError] = useState<string>();
  
    const [productNameAr, setProductNameAr] = useState<string | undefined>();
    const [productNameEn, setProductNameEn] = useState<string | undefined>();
    const [productDescEn, setProductDescEn] = useState<string | undefined>();
    const [productDescAr, setProductDescAr] = useState<string | undefined>();
    const [price, setPrice] = useState<number>();
    const [quantity, setQuantity] = useState<number>();
    const [categoryId, setCategoryId] = useState<number>(1);
    const [DiscountPercentage, setDiscountPercentage] = useState<number>();

    const [productNameArErr, setProductNameArErr] = useState<string>();
    const [productNameEnErr, setProductNameEnErr] = useState<string>();
    const [productDescEnErr, setProductDescEnErr] = useState<string>();
    const [productDescArErr, setProductDescArErr] = useState<string>();
    const [priceErr, setPriceErr] = useState<string>();
    const [quantityErr, setQuantityErr] = useState<string>();
    const [DiscountPercentageErr, setDiscountPercentageErr] = useState<string>();
    const [productId, setProductId] = useState<number>();
    const dropdownStyles: Partial<IDropdownStyles> = {
        dropdown: { width: 300 },
      };
    const createProduct = async () => {
        try {
           debugger;
            const client = ServiceCreator.getElectronicsShopClient();
            const requestDto=new AddProductRequestDto();
            requestDto.nameAr=productNameAr;
            requestDto.nameEn=productNameEn;
            requestDto.descAr=productDescAr;
            requestDto.descEn=productDescEn;
            requestDto.categoryId=categoryId??0;
            requestDto.discountPercentage=DiscountPercentage??0;
            requestDto.price=price??0;
            requestDto.quantity=quantity??0;
           const response= await client.addProduct(requestDto);
           setProductId(response);
           if(onSave)onSave(response);
        } catch (ex) {
            const Err=UIHelpers.GetError(ex);
            const ErrMsg=
                         Err?.BusinessErrors??
                         Err?.ExceptionMessage??'';
                         setError(ErrMsg);
        }
    }; 
 
    
   const ValidateAllFields=(val:string,field:string):boolean=>{
       let isValid=false;
       switch (field) {
           case Fields.NameAr:
               {
                   if(val==='')
                   {
                   setProductNameArErr(t('NameArIsRequired'));
                   isValid=false;
                  }
                   else{
                   setProductNameArErr('');
                isValid=true;
                }
                break;

               }
               case Fields.NameEn:
                {
                    if(val==='')
                    {
                    setProductNameEnErr(t('NameEnIsRequired'));
                    isValid=false;
                   }
                    else{
                    setProductNameEnErr('');
                 isValid=true;
                 }
                 break;
 
                }
                case Fields.DescAr:
               {
                   if(val==='')
                   {
                   setProductDescArErr(t('DescArIsRequired'));
                   isValid=false;
                  }
                   else{
                    setProductDescArErr('');
                isValid=true;
                }
                break;

               }
               case Fields.DescEn:
               {
                   if(val==='')
                   {
                   setProductDescEnErr(t('DescEnIsRequired'));
                   isValid=false;
                  }
                   else{
                    setProductDescEnErr('');
                isValid=true;
                }
                break;

               }
               case Fields.Price:
               {
                   if(val==='0'||val==='')
                   {
                   setPriceErr(t('PriceIsRequired'));
                   isValid=false;
                  }
                   else{
                    setPriceErr('');
                isValid=true;
                }
                break;

               }
               case Fields.Quantity:
               {
                   if(val===''||val==='0')
                   {
                   setQuantityErr(t('QuantityIsRequired'));
                   isValid=false;
                  }
                   else{
                    setQuantityErr('');
                isValid=true;
                }
                break;

               }
           default:
            case Fields.All:
                {
                    if(productNameAr==='')
                    {
                    setProductNameArErr(t('NameArIsRequired'));
                    isValid=false;
                   }
                    else{
                        setProductNameArErr('');
                 isValid=true;
                 }
                 if(productNameEn==='')
                 {
                 setProductNameEnErr(t('NameEnIsRequired'));
                 isValid=false;
                }
                 else{
                 setProductNameEnErr('');
              isValid=true;
              }
              if(productDescAr==='')
              {
              setProductDescArErr(t('DescArIsRequired'));
              isValid=false;
             }
              else{
               setProductDescArErr('');
           isValid=true;
           }
           if(productDescEn ==='')
           {
           setProductDescEnErr(t('DescEnIsRequired'));
           isValid=false;
          }
           else{
            setProductDescEnErr('');
        isValid=true;
        }
        if(price===0)
                   {
                   setPriceErr(t('PriceIsRequired'));
                   isValid=false;
                  }
                   else{
                    setPriceErr('');
                isValid=true;
                }
                if(quantity===0)
                   {
                   setQuantityErr(t('QuantityIsRequired'));
                   isValid=false;
                  }
                   else{
                    setQuantityErr('');
                isValid=true;
                }
                 break;
 
                }
       }
       return isValid;
   }
   const checkFormat = (val: string | undefined,inputType:InputType) => {
    if (inputType && val) {
      switch (inputType) {
        case InputType.Number:
          return /^[0-9]+$/.test(val);
        case InputType.DecimalNumber:
          return /^[0-9]+\.?[0-9]*$/.test(val);
        case InputType.LetterOnly:
          // eslint-disable-next-line no-useless-escape
          return /^[a-zA-Z ,-@\(\)]+$/.test(val);
        default:
          return true;
      }
    }
    return true;
  };
    return (
        <Suspense fallback={<div>Loading... </div>}>
            {CategoriesLookups.length>0&&(
            <Dialog
                containerClassName="System"
                hidden={hidden}
                onDismiss={() => {
                    if(onClose)onClose();
                }}
                //loadingText={loadText}
                maxWidth={750}
                title={t('AddProduct')}
            >
                <div className="trustedSystem">
                    {error && (
                        <MessageBar
                            messageBarType={MessageBarType.error}
                            isMultiline={false}
                            className="messageBar"
                        >
                            {error}
                        </MessageBar>
                    )}
                    <>      
                            
                            <Dropdown
                                selectedKey={categoryId}
                                label={t('Categories')}
                                onChange={(event: any, Select: any) => {
                                    setCategoryId(Select.key);
                                }}
                                options={CategoriesLookups??[]}
                                styles={dropdownStyles}
                            />
                            <TextField
                                required
                                label={t('productNameAr')}
                                value={productNameAr ?? ''}
                                maxLength={250}
                                errorMessage={ productNameArErr}
                                onChange={(_, val) => {
                                    setProductNameAr(val);
                                    ValidateAllFields(val??'',Fields.NameAr); setError('');} }
                            />
                            <TextField
                                required
                                label={t('productNameEn')}
                                value={productNameEn ?? ''}
                                maxLength={250}
                                errorMessage={ productNameEnErr}
                                onChange={(_, val) => {setProductNameEn(val);ValidateAllFields(val??'',Fields.NameEn);setError(''); }}
                            />
                            <TextField
                                required
                                label={t('productDescAr')}
                                value={productDescAr ?? ''}
                                maxLength={250}
                                errorMessage={ productDescArErr}
                                onChange={(_, val) => {setProductDescAr(val);ValidateAllFields(val??'',Fields.DescAr); setError(''); }}
                            />
                            <TextField
                                required
                                label={t('productDescEn')}
                                value={productDescEn ?? ''}
                                maxLength={250}
                                errorMessage={ productDescEnErr}
                                onChange={(_, val) => {setProductDescEn(val);ValidateAllFields(val??'',Fields.DescEn); setError(''); }}
                            />
                            <TextField
                                required
                               type='number'
                               pattern="/^[0-9]+\.?[0-9]*$/"
                                label={t('price')}
                                value={price?.toString() ?? ''}
                                maxLength={250}
                                errorMessage={ priceErr}
                                onChange={(_, val) => {checkFormat(val,InputType.DecimalNumber);setPrice(Number(val));ValidateAllFields(val??'0',Fields.Price); setError(''); }}
                            />
                            <TextField
                                required
                               type='number'
                               step={1}
                                label={t('quantity')}
                                value={quantity?.toString() ?? ''}
                                maxLength={250}
                                errorMessage={ quantityErr}
                                onChange={(_, val) => {checkFormat(val,InputType.Number);setQuantity(Number(val));ValidateAllFields(val??'0',Fields.Quantity); setError(''); }}
                            />
                            <TextField
                               type='number'
                               pattern="/^[0-9]+\.?[0-9]*$/"
                                label={t('DiscountPercentage')}
                                value={DiscountPercentage?.toString() ?? ''}
                                maxLength={250}
                                errorMessage={ DiscountPercentageErr}
                                onChange={(_, val) => {checkFormat(val,InputType.DecimalNumber);setDiscountPercentage(Number(val));setDiscountPercentageErr(''); setError(''); }}
                            />
                                        
                                
                            <PrimaryButton
                                    className='save'
                                    menuIconProps={ { iconName: 'Save' }}
                                    disabled={(error??'')!==''||(DiscountPercentageErr??'')!==''||(priceErr??'')!==''||(quantityErr??'')!==''
                                    ||(productNameArErr??'')!==''||(productNameEnErr??'')!==''||(productDescArErr??'')!==''||(productDescEnErr??'')!==''}
                                    text={ t('Save') }
                                    onClick={() => { ValidateAllFields('',Fields.All); createProduct(); onClose();}}

                            />
                        </>
                
                </div>
            </Dialog>
            )}
        </Suspense>
    );
};

export default AddProductDialog;
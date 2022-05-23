/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
import { isNullOrUndefined } from 'util';
import i18n from '../i18n';
import Moment from 'moment';

export const Dates = {
    dateFormat: 'YYYY-MM-DD',
    dateTimeFormat: 'YYYY-MM-DD HH:mm A',
    dateTimeFormat24: 'YYYY-MM-DD HH:mm',
    timeFormat: 'HH:mm',
    timeFormatfull: 'HH:mm:ss',
    locale: 'en',
    Today: 'Today',
    Date: 'DD/MM/YYYY',
    dateTimeFormatFull: 'YYYY-MM-DD HH:mm:ss',
    dateTimeFormatFull12: 'DD/MM/YYYY h:mm:ss a',

};
export class UIHelpers {
   
  

    public static getUTC(datetime: Date) {
        const dateAsString = datetime
            ?.toISOString()
            .substring(0, datetime?.toISOString().length - 1);
        const dateUtc = new Date(dateAsString);
        return dateUtc;
    }

    public static formatDate(datetime: Date | undefined, langIso4: string) {
        if (datetime) {
            return `${datetime.toLocaleDateString(langIso4)} ${datetime
                .toLocaleTimeString(
                    langIso4.startsWith('ar') ? 'ar-EG' : 'en-US',
                    {
                        hour12: true,
                    }
                )
                .toUpperCase()}`;
        }
        return '';
    }

    public static formatDateForReport(
        cairoTime: boolean,
        cairoLabel: string,
        langIso4: string,
        datetime?: Date
    ) {
        const l = langIso4;

        if (datetime) {
            const dateUtc = UIHelpers.getUTC(datetime);

            let localtime = `${datetime.toLocaleDateString(l)} ${datetime
                .toLocaleTimeString(l.startsWith('ar') ? 'ar-EG' : 'en-US', {
                    hour12: true,
                })
                .toUpperCase()}`;

            if (cairoTime) {
                localtime = UIHelpers.getCairoTime(dateUtc, l, cairoLabel);
            }

            return `${localtime} (${dateUtc.toLocaleDateString(l)} ${dateUtc
                .toLocaleTimeString(l.startsWith('ar') ? 'ar-EG' : 'en-US', {
                    hour12: true,
                })
                .toUpperCase()} UTC)`;
        }
        return '';
    }

    public static getCairoTime(
        dateUtc: Date,
        languageIso: string,
        cairoLabel: string
    ) {
        const newDate = new Date(dateUtc);
        const hoursShift = 2;
        newDate.setHours(newDate.getHours() + hoursShift);
        return `${newDate.toLocaleDateString(languageIso)} ${newDate
            .toLocaleTimeString(
                languageIso.startsWith('ar') ? 'ar-EG' : 'en-US',
                {
                    hour12: true,
                }
            )
            .toUpperCase()} (${cairoLabel})`;
    }

    public static AdjustDate = (date?: Date): Date | undefined => {
        if (!date) return undefined;
        const now: Date = new Date();
        const dateTime: Date = new Date(date ?? now);

        dateTime.setHours(23);
        dateTime.setMinutes(59);
        dateTime.setSeconds(59);
        return dateTime;
    };

    public static AdjustDateTime = (
        date: Date | undefined,
        hours: number | undefined = undefined,
        minutes: number | undefined = undefined,
        seconds: number | undefined = undefined
    ): Date | undefined => {
        if (!date) return undefined;
        const now: Date = new Date();
        const dateTime: Date = new Date(date ?? now);

        dateTime.setHours(hours ?? date.getHours());
        dateTime.setMinutes(minutes ?? date.getMinutes());
        dateTime.setSeconds(seconds ?? date.getSeconds());
        return dateTime;
    };

   
    public static GetCustomErrors(exp: any): any {
        // eslint-disable-next-line no-param-reassign
        exp.response = exp.response || { error: {} };
        // eslint-disable-next-line no-param-reassign
        exp.response.details = exp.response.details || {};

        const {
            response: { details, message },
            status,
        } = exp;

        const errors: any = {};
        switch (status) {
            // bad request : validation error
            case 400:
            case 404:
                // eslint-disable-next-line no-restricted-syntax
                if (details && Object.keys(details).length) {
                    // eslint-disable-next-line no-restricted-syntax
                    for (const error of details) {
                        if (error.target)
                            errors[error.target?.split(' ')?.join('')] =
                                error.message;
                        else
                            errors.BusinessErrors =
                                (errors.BusinessErrors ?? '') + error.message;
                    }
                }
                break;
            default:
                errors.ExceptionMessage = message;
                break;
        }
        if (details && details.length > 0) return details[0];
        if (message) return { message };
        return 'Error occured while processing';
    }

    public static getDateFormatted = (
        dateString: string | undefined,
        dateFormat: string
    ): Date | undefined => {
        if (dateString === '' || dateString === undefined) return undefined;
        const dateMomentObject = Moment(dateString, dateFormat);
        const dateObject = dateMomentObject.toDate();
        return dateObject;
    };

    public static replaceUndefined = (data: any) => {
        const newData = data.map((item: any, index: number) => {
            const newObject = JSON.stringify(data[index], (key, value) =>
                value === undefined || value === null ? '' : value
            );

            return JSON.parse(newObject);
        });

        return newData;
    };

    public static getDateFormattedstr = (
        dateString: string,
        dateFormat: string
    ): string => {
        if (!dateString) return dateString;
        const dateMomentObject = Moment(dateString).format(dateFormat);
        return dateMomentObject;
    };

    public static addDays(date: Date, days: number): Date | undefined {
        if (!Moment(date, 'DD/MM/YYYY', true).isValid()) return undefined;

        date.setDate(date.getDate() + days);
        return date;
    }

    public static GetErrors(exp: any): any {
        // eslint-disable-next-line no-param-reassign
        exp.response = exp.response || { error: {} };
        // eslint-disable-next-line no-param-reassign
        exp.response.error = exp.response.error || {};
        // eslint-disable-next-line no-param-reassign
        exp.response.error.details = exp.response.error.details || {};

        const {
            response: {
                error: { details },
            },
            message,
            status,
        } = exp;

        const errors: any = {};
        switch (status) {
            // bad request : validation error
            case 400:
            case 404:
                // eslint-disable-next-line no-restricted-syntax
                if (details && Object.keys(details).length) {
                    // eslint-disable-next-line no-restricted-syntax
                    for (const error of details) {
                        if (error.target)
                            errors[error.target?.split(' ')?.join('')] =
                                error.message;
                        else
                            errors.BusinessErrors =
                                (errors.BusinessErrors ?? '') + error.message;
                    }
                }
                break;
            default:
                errors.ExceptionMessage = message;
                break;
        }
        return errors;
    }

   

    public static GetError(exp: any): any {
        // eslint-disable-next-line no-param-reassign
        exp.response = exp?.response || { data: { error: {} } };
        // eslint-disable-next-line no-param-reassign
        exp.response.data.error = exp?.response?.data?.error || {};
        // eslint-disable-next-line no-param-reassign
        exp.response.data.error.details =
            exp.response?.data?.error?.details || {};
        // eslint-disable-next-line no-param-reassign
        exp.response.data.error.message =
            exp.response?.data?.error?.message || {};

        const {
            data: {
                error: { details },
            },
            message,
            status,
        } = exp?.response ?? {};

        const errors: any = {};
        switch (status) {
            // bad request : validation error
            case 400:
                // eslint-disable-next-line no-restricted-syntax
                if (details !== undefined && Object.keys(details).length) {
                    // eslint-disable-next-line no-restricted-syntax
                    for (const error of details) {
                        if (error.target) errors[error.target] = error.message;
                        else
                            errors.BusinessErrors =
                                (errors.BusinessErrors ?? '') + error.message;
                    }
                } else {
                    errors.BusinessErrors = exp.response?.data?.error?.message;
                }
                break;
            default:
                errors.ExceptionMessage = message;
                break;
        }
        return errors;
    }

    public static getArrayError = (
        error: any | undefined,
        arrayName: any,
        index: number,
        target: string
    ) => {
        return error?.hasOwnProperty(`${arrayName}[${index}].${target}`)
            ? error[`${arrayName}[${index}].${target}`]
            : '';
    };
public static currentLang=()=>{
    return localStorage.getItem('i18nextLng')??'';
}
    public static isArLang = () =>{
       return UIHelpers.currentLang().trim().toLowerCase().startsWith('ar');
    }
    public static GetLocalized(
        enValue: string | undefined,
        arValue: string | undefined
    ) {
        const newArValue = !arValue ? enValue : arValue;
        return (UIHelpers.isArLang() ? newArValue : enValue) ?? '';
    }

    public static OpenContentInNewTab = (content: any, contentType: string) => {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        window.open(url);
        URL.revokeObjectURL(url);
    };

    public static dateInPast = (date: Date | undefined) => {
        const dateWithoutTime = new Date(date ?? new Date());
        dateWithoutTime.setHours(0, 0, 0, 0);
        const nowWithoutTime = new Date();
        nowWithoutTime.setHours(0, 0, 0, 0);
        return !!(date && dateWithoutTime < nowWithoutTime);
    };

    public static getDatePart = (datetime: Date) =>
        datetime.setHours(0, 0, 0, 0);

    public static getFormattedDate = (
        date: Date | undefined,
        locale?: string
    ) => {
        if (!date) return '';

        // const newDate = new Date(`${date}Z`);
        const localDate = date.toLocaleString();
        Moment.locale(locale || Dates.locale);

        return Moment(localDate).format('DD/MM/YYYY');
    };

    public static getFormattedDateTime = (date: Date | undefined) => {
        if (!date) return '';

        // const newDate = new Date(`${date}Z`);
        const localDate = date.toLocaleString();
        Moment.locale(Dates.locale);

        return Moment(localDate).format('DD/MM/YYYY h:mm a');
    };

    public static getFullFormattedDateTime = (date: Date | undefined) => {
        if (!date) return '';

        // const newDate = new Date(`${date}Z`);
        const localDate = date.toLocaleString();
        Moment.locale(Dates.locale);

        return Moment(localDate).format(Dates.dateTimeFormatFull12);
    };

    public static getFullFormattedDate = (date: Date | undefined) => {
        if (!date) return '';
        return Moment(date).format(Dates.dateTimeFormatFull12);
    };

    public static getFormattedTime = (date: Date | undefined) => {
        if (!date) return '';

        // const newDate = new Date(`${date}Z`);
        const localDate = date.toLocaleString();
        Moment.locale(Dates.locale);

        return Moment(localDate).format('HH:mm');
    };

    public static FormatDatePickerValue = (
        date: Date | undefined,
        currentLocale?: string
    ): string => {
        const locale =
            currentLocale && currentLocale !== '' ? currentLocale : 'en-gb'; // default

        if (locale?.trim().toLocaleLowerCase().startsWith('en')) {
            return date
                ? `${date
                      .getDate()
                      .toLocaleString(locale, { minimumIntegerDigits: 2 })}/${(
                      date.getMonth() + 1
                  ).toLocaleString(locale, { minimumIntegerDigits: 2 })}/${date
                      .getFullYear()
                      .toLocaleString(locale)
                      .replace(/,/g, '')}`
                : '';
        }
        return date
            ? `${date
                  .getFullYear()
                  .toLocaleString(locale)
                  .replace(/٬/g, '')}/${(date.getMonth() + 1).toLocaleString(
                  locale,
                  { minimumIntegerDigits: 2 }
              )}/${date
                  .getDate()
                  .toLocaleString(locale, { minimumIntegerDigits: 2 })}`
            : '';
    };

    public static ParseDatePickerString = (val: string): Date | null => {
        const values = (val || '').trim().split('/');
        const day =
            val.length > 0
                ? Math.max(1, Math.min(31, parseInt(values[0], 10)))
                : null;
        const month =
            val.length > 1
                ? Math.max(1, Math.min(12, parseInt(values[1], 10))) - 1
                : null;
        const year = val.length > 2 ? parseInt(values[2], 10) : null;

        return day && month && year ? new Date(year, month, day) : null;
    };

   

    public static getLocalizedNumber = (
        number?: number,
        locale?: string,
        fixed = 2
    ) => {
        let value: number = number || 0;
        if (isNullOrUndefined(number)) value = 0;
        let formatted = value.toLocaleString(locale || 'en-US', {
            maximumFractionDigits: fixed,
            minimumFractionDigits: fixed,
        });
        if (fixed !== 2) {
            const parts = formatted.split('.');
            if (parts[1] && parts[1].length < fixed) {
                const diff = fixed - parts[1].length;
                for (let i = 0; i < diff; i += 1) {
                    formatted += '  ';
                }
            }
        }
        return formatted;
    };

   
    public static getFormattedNumber = (number?: number) => {
        if (i18n.language !== 'ar') return number;

        const arabicNumbers =
            '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
        return number?.toString().replace(/[0123456789]/g, (d: any) => {
            return arabicNumbers[d];
        });
    };

   
    public static formatDeviceItems = (data: any, page?: string) => {
        const newData: any[] = [];
        for (let i = 0; i < data.length; i += 1) {
            const arrayValue = Object.keys(data[i]);
            newData.push(
                Object.keys(data[i]).reduce(
                    (device, key: string, index: number) => {
                        if (
                            index !== 1 &&
                            index % 2 === 0 &&
                            index < (page === 'DevicesGrid' ? 7 : 6)
                        ) {
                            // eslint-disable-next-line no-unused-expressions
                            return UIHelpers.currentLang() === 'en'
                                ? Object.assign(device, {
                                      [key
                                          .concat('/')
                                          .concat(arrayValue[index + 1])]: `${
                                          data[i][key]
                                      } / ${data[i][arrayValue[index + 1]]}`,
                                  })
                                : Object.assign(device, {
                                      [arrayValue[index + 1]
                                          .concat('/')
                                          .concat(key)]: `${
                                          data[i][arrayValue[index + 1]]
                                      }/${data[i][key]}`,
                                  });
                        }
                        return Object.assign(device, {
                            [key]: data[i][key],
                        });
                    },
                    {}
                )
            );
        }
        return newData;
    };

   
    public static getDefaultLocalizedNumber = (
        number?: number,
        locale?: string
    ) => {
        let value: number = number || 0;
        if (isNullOrUndefined(number)) value = 0;
        const formatted = value.toLocaleString(locale || 'en-US');
        return formatted;
    };

    public static DownloadExcelFile = (content: any) => {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        window.open(url);
        URL.revokeObjectURL(url);
    };

  

    public static IsEmptyString(val?: string): boolean {
        return val?.trim().length === 0;
    }

    public static HasMinLength(val?: string, length?: number): boolean {
        const valLength = val?.trim().length ?? 0;
        return valLength >= (length ?? 0);
    }
}

export const EnsureNotSlashAtEnd = (url: string): string => {
    const lastIndex = url.lastIndexOf('/');
    if (lastIndex !== 1) {
        return url.slice(0, lastIndex);
    }
    return url;
};

export const SuccessMessageDuration: number = 10000;

export const NumberOfShimmerLines: number = 5;

import { AxiosRequestConfig } from "axios";
import { AuthenticationService } from "./AuthenticationService";
import i18n from 'i18next';
import { JWT } from "../../Models/JWT";
import jwt from 'jwt-decode' // import dependency

export interface ClientApiConfig {
    authService: AuthenticationService;
    apiGatewayUrl: string;
    apiVersion: number;
    enableAnonymousCall?: boolean;
    disableGlobalErrorCatch?: boolean;
  }
export abstract class BaseClientApi {
    protected configuration: ClientApiConfig;
  
    public constructor(configuration: ClientApiConfig) {
      this.configuration = configuration;
    }
  
    protected getBaseUrl(defaultUrl: string): string {
      if (defaultUrl === '') {
        return this.configuration.apiGatewayUrl;
      }
      return defaultUrl;
    }
  
    private async getUserTokenAsync(): Promise<string> {
      let token= localStorage.getItem('jwt')??'';
     /* debugger;
      const user:JWT = jwt(token); 
      if (user && user.access_token) {
        return user.access_token;
      }
  
      this.configuration.authService.login(); */
      return token;
    }
  
    protected async transformOptions(
      options: AxiosRequestConfig
    ): Promise<AxiosRequestConfig> {
      let url_ = options.url;
      if (url_) {
        url_ = url_.replace(
          '{version}',
          encodeURIComponent(`${this.configuration.apiVersion}`)
        );
      }
      let headers;
      if (!this.configuration.enableAnonymousCall) {
        const accessToken = await this.getUserTokenAsync();
        headers = {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': i18n.language,
        };
      } else {
        headers = {
          'Accept-Language': i18n.language,
        };
      }
  
      return {
        ...options,
        url: url_,
        headers: { ...options.headers, ...headers },
      };
    }
  }
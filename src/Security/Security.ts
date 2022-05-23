import { AuthenticationService } from "../ElectronicsShop/Service/Helpers/AuthenticationService";
import { ISecurityConfig } from "../ElectronicsShop/Service/Helpers/ISecurityConfig";

export const securityConfig: ISecurityConfig = {
    stsAuthority:  (window as any).REACT_APP_stsAuthority,
    clientId: (window as any).REACT_APP_clientId,
    clientScope: (window as any).REACT_APP_clientScope,
    clientRoot:  (window as any).REACT_APP_clientRoot,
    defaultPath: './home'
};
export const authService = new AuthenticationService(securityConfig);
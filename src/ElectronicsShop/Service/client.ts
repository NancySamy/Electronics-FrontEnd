import { EnsureNotSlashAtEnd } from '../../helpers/UIHelpers';
import { authService } from '../../Security/Security';
import { CreateAxiosInstance } from './Helpers/Interceptor';
import { IElectronicsShopClient,ElectronicsShopClient } from './proxy';

const BaselUrl = EnsureNotSlashAtEnd('https://localhost:7244/');
export class ServiceCreator {

    public static getElectronicsShopClient(): IElectronicsShopClient {
        return new ElectronicsShopClient({
            authService,
            apiGatewayUrl: BaselUrl,
            apiVersion: 1
        },undefined, CreateAxiosInstance(true));
    }

   
}

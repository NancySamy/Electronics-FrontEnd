/* eslint-disable camelcase */
import { Log, User, UserManager, UserManagerSettings } from 'oidc-client';
import { ISecurityConfig } from './ISecurityConfig';
import { EtaUser } from './IUserProfileExtension';
import { UserRole } from './EnumRole';

export type OnUserLoaded = (user: EtaUser) => void;

export class AuthenticationService {
  public userManager: UserManager;

  private defaultPath: string;

  private onLoginRequired: (() => void)[] = [];

  private mainPage: string;
  
  private logoutSync?: boolean;

  public currentUser: EtaUser | null = null;
  

  constructor(config: ISecurityConfig) {
  debugger;
    const settings: UserManagerSettings = {
      authority: config.stsAuthority,
      client_id: config.clientId,
      redirect_uri: `${config.clientRoot}login`,
      silent_redirect_uri: `${config.clientRoot}silentLogin`,
      post_logout_redirect_uri: `${config.clientRoot}`,
      response_type: 'id_token token',
      revokeAccessTokenOnSignout: true,
      loadUserInfo: true,
      automaticSilentRenew: false,
      scope: config.clientScope,
    };
    this.defaultPath = config.defaultPath ?? './';
    this.mainPage = config.clientRoot;
    this.logoutSync = config.logoutSync;
    this.userManager = new UserManager(settings);
    debugger;
    this.userManager.events.addUserLoaded(async (user: User) => {
      await this.setCurrentUser(user as EtaUser);
    });
    this.userManager.events.addUserSignedOut(async ()=>{
      // eslint-disable-next-line no-console
      console.log(`receive addUserSignedOut event`);
      if (this.logoutSync){
        await this.logout();
      }
    });
    this.userManager.events.addUserUnloaded(async ()=>{
      // eslint-disable-next-line no-console
      console.log(`receive addUserUnloaded`);
      this.setCurrentUser(undefined);
     });
    this.userManager.events.addAccessTokenExpiring(() => {
      this.onAccessTokenExpiring();
    });
    this.setCurrentUser();// Set the current if it exist
    Log.logger = console;
    Log.level = Log.INFO;
  }

  public onCurrentUserLoaded?: OnUserLoaded = undefined;

  public addOnloginRequired(callback: () => void) {
    this.onLoginRequired.push(callback);
  }

  public removeOnloginRequired(callback: () => void) {
    this.onLoginRequired = this.onLoginRequired.filter((ev) => ev !== callback);
  }

  public static getUserRoles = (user: EtaUser|null|undefined): UserRole[] => {
    debugger;
    const roles: UserRole[] = [];
    if (user) {
      const userProfile = user.profile;

      if (userProfile.role === 'Admin') {
        roles.push(UserRole.Admin);
      } else if (userProfile.role === 'User') {
        roles.push(UserRole.User);
      }
     
    }
    return roles;
  } 

  public get currentUserRoles(): UserRole[] {
    return (AuthenticationService.getUserRoles(this.currentUser));
  }


  public clearStaleState(): Promise<void> {
    // prevent Error: No matching state found in storage,
    // which can happen due to duplicate state entries
    return this.userManager.clearStaleState();
  }

  private async onAccessTokenExpiring() {
    const user = await this.getUser();
    try {
      if (user) {
        await this.renewToken();
      }
    } catch (error:any) {
      if (error.message === 'login_required') {
        this.onLoginRequired.forEach((ev) => ev());
        if (user?.expires_in) {
          setTimeout(() => {
            this.login();
          }, user?.expires_in * 1000);
        } else {
          this.login();
        }
      }
    }
  }

  private static getUserFromStorage(): User | null {
    const data = localStorage.getItem('USER_DATA');
    if (data) {
      const userData = new User(JSON.parse(data));
      if (userData && userData.expired === false) {
        return userData;
      }
    }
    return null;
  }

  private async setCurrentUser(user?: EtaUser): Promise<void> {
    let newUser = user;
    if (!user){
      newUser = (await this.userManager.getUser()) as EtaUser;
    }
    if (newUser) {
      this.currentUser = newUser;
      localStorage.setItem('USER_DATA', JSON.stringify(newUser));
      if (this.onCurrentUserLoaded){
         this.onCurrentUserLoaded(newUser);
      }
    }
  }

  public async getUser(): Promise<EtaUser | null> {
    if (this.currentUser && !this.currentUser.expired) {
      return this.currentUser;
    }
    const user = (await this.userManager.getUser()) as EtaUser;
    if (!user || user.expired) {
      this.currentUser = null;
      return null;
    }
    this.currentUser = user;
    return user;
  }

  public login(url?: string): Promise<void> {
    let redirectUrl = url;
    if (!redirectUrl) {
      const { location } = window;
      redirectUrl = location.pathname + location.search;
    }

    localStorage.setItem('REQUEST_URL', redirectUrl);
    return this.userManager.signinRedirect();
  }

  public async loginCallback(url: string): Promise<EtaUser|null> {
    
    const requestUrl = localStorage.getItem('REQUEST_URL');
    // remove orphan OIDC state, To prevent the Error: No matching state found in storage,
    // eslint-disable-next-line no-console
    this.clearStaleState().then(()=>{ console.log('clearStaleState success');}).catch(()=>{console.log('clearStaleState failed');});
    if (!requestUrl){
      // eslint-disable-next-line no-console
      console.log('no REQUEST_URL, navigate to main page.');
      await this.login(this.mainPage);
      return (null);
    }
    let newUser;
    try {
      
      newUser = await this.userManager.signinRedirectCallback(url);

    } catch (error) {
      console.error(error);
      await this.login(this.mainPage);
      return (null);
     // newUser = await this.userManager.getUser();
    }
    try {
      if (newUser){
          await this.setCurrentUser(newUser as EtaUser); 
          document.location.href = requestUrl ?? this.defaultPath;
          localStorage.removeItem('REQUEST_URL');
          return (newUser as EtaUser);
      }
    } catch (error) {
      console.error(error);
    }
    return (null);
  }

  public async signinSilentCallback(url?: string): Promise<void> {
    try {
      await this.userManager.signinSilentCallback(url);
      await this.setCurrentUser();
    } catch (error) {
      console.error(error);
    }
  }

  public refreshToken(): Promise<User> {
    return this.renewToken();
  }

  private renewToken(): Promise<User> {
    return this.userManager.signinSilent();
  }

  public async logout(): Promise<void> {
    
    // eslint-disable-next-line no-console
    console.log('logout() is called');

    let user;
    try{
      user = await this.getUser();
      localStorage.removeItem('USER_DATA');
      localStorage.removeItem('TaxpayerNameAR');
      localStorage.removeItem('TaxpayerNameEN');
      await this.userManager.removeUser().catch((reason) => {
        console.error(reason);
      });
    }catch (reason){
      console.error(reason);
    }
    if (user){
      this.setCurrentUser(undefined);
      await this.userManager
        .signoutRedirect({ id_token_hint: user && user.id_token })
        .then( ()=>{
              // eslint-disable-next-line no-console
            console.log('signoutRedirect success');
        })
        .catch((reason) => {
          console.error(reason);
        });
    } else {
           // eslint-disable-next-line no-console
           console.log('user not found for logout.');
    }
  }

  public async ensureLogin(url: string): Promise<boolean> {
    let currentUser = (await this.userManager.getUser()) as EtaUser;
    if (!currentUser) {
      const userFromStorage = AuthenticationService.getUserFromStorage();
      if (userFromStorage) {
        this.userManager.storeUser(userFromStorage);
        currentUser = (await this.userManager.getUser()) as EtaUser;
      }
    }

    if (!currentUser || currentUser.expired) {
      this.currentUser = null;
      await this.login(url);
      return false;
    }
    this.currentUser = currentUser;
    return true;
  }
}

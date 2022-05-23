export interface ISecurityConfig {
    stsAuthority: string;
    clientId: string;
    clientScope: string;
    clientRoot: string;
    defaultPath: string;
    logoutSync?: boolean;
  }
  
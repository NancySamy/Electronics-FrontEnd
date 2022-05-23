import { Profile, User } from 'oidc-client';
import { PermissionClaim } from './Claim';

export interface IProfileExtension {
  // Properties start by captital later because it's configure like this in the token
  // constant defined here src/Core/Core.Framework/Infrastructure/Security/Constants/CustomClaimTypes.cs
  Email: string;
  locale: string | string[];
  role: string[] | string; // JwtClaimTypes.Role
}
export interface IUserProfileExtension {
  profile: Profile & IProfileExtension;
}
export type EtaUser = User & IUserProfileExtension;

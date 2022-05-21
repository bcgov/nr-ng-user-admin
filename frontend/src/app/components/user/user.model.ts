
export interface OIDCUser {
    id: string;
    createdTimestamp: number;
    username: string;
    enabled: boolean;
    totp: boolean;
    emailVerified: boolean;
    firstName: string;
    lastName: string;
    email: string;
    attributes: {
        idir_user_guid: string[];
        idir_userid: string[];
        idir_username:string[];
        displayName: string[];
    },
    disableableCredentialTypes: [];
    requiredActions: [];
    notBefore: number;
    access: {
        manageGroupMembership: boolean;
        view: boolean;
        mapRoles: boolean;
        impersonate: boolean;
        manage: boolean;
    }
}
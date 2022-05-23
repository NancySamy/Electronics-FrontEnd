export enum PermissionClaim {
    // Document Claims
    ViewDoc = 'ViewDoc',
    SubmitDoc = 'SubmitDoc',
    CancelDoc = 'CancelDoc',
    RejectDoc = 'RejectDoc',
    DecCancelDoc = 'DecCancelDoc',
    DecRejectDoc = 'DecRejectDoc',
    ExportDoc = 'ExportDoc',
  
    // Taxpayer Claims
    MngContact = 'MngContact',
    MngRepres = 'MngRepres',
    MngERP = 'MngERP',
    MngTaxInter = 'MngTaxInter',
    MngCodes = 'MngCodes',
    ViewSummary = 'ViewSummary',
  
    // Notification Claims
    ViewNotification = 'ViewNotification',
    
    MngPOS = 'MngPOS',
  }
  
  export enum Claim {
    Branches = 'Branches',
    IsTaxAdmin = 'IsTaxAdmin',
    IsTaxRepres = 'IsTaxRepres',
    IsSystem = 'IsSystem',
    IsDelegate = 'IsDelegate',
    IsAdminDelegate = 'IsAdminDelegate',
    IsIntermediary = 'IsIntermediary'
  }
  
  
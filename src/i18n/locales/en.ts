const en = {
  shared: {
    common: {
      action: {
        save: 'Save',
        cancel: 'Cancel',
        create: 'Create',
        delete: 'Delete',
        edit: 'Edit',
        search: 'Search',
        back: 'Back',
      },
      status: {
        enabled: 'Enabled',
        disabled: 'Disabled',
        loading: 'Loading...',
      },
      label: {
        actions: 'Actions',
        status: 'Status',
        name: 'Name',
        description: 'Description',
        tenantCode: 'Tenant Code',
      },
      confirm: {
        delete: 'Are you sure you want to delete?',
      },
      error: {
        createFailed: 'Failed to create',
        updateFailed: 'Failed to update',
      },
    },
  },
  hyadmin: {
    header: {
      nav: {
        title: 'HySP Console',
        admin: 'Admin',
        profile: 'Profile',
        logout: 'Logout',
      },
    },
    sidebar: {
      nav: {
        groupAccounts: 'Accounts',
        groupSystem: 'System',
        users: 'Users',
        roles: 'Roles',
        modules: 'Modules',
        auditLogs: 'Audit Logs',
        selectModule: 'Select a module from the top bar',
      },
    },
    breadcrumb: {
      nav: {
        home: 'Home',
        admin: 'Admin',
        users: 'Users',
        roles: 'Roles',
        modules: 'Modules',
        auditLogs: 'Audit Logs',
        features: 'Features',
        new: 'New',
      },
    },
    login: {
      header: {
        title: 'HySP Admin',
        subtitle: 'Administrator Login',
      },
      form: {
        labelTenantCode: 'Tenant Code',
        labelUsername: 'Username',
        labelPassword: 'Password',
        buttonSubmit: 'Login',
      },
      error: {
        failed: 'Login failed',
      },
    },
    dashboard: {
      header: {
        title: 'Dashboard',
        hint: 'Select a module from the sidebar to get started.',
      },
    },
    users: {
      header: {
        title: 'User Management',
        buttonNew: 'New User',
      },
      table: {
        columnUsername: 'Username',
        columnDisplayName: 'Display Name',
        columnEmail: 'Email',
        columnTenant: 'Tenant',
        columnProvider: 'Provider',
      },
      form: {
        labelUsername: 'Username',
        labelDisplayName: 'Display Name',
        labelEmail: 'Email',
        labelTenant: 'Tenant',
        labelProvider: 'Provider',
      },
      confirm: {
        delete: 'Are you sure you want to delete this user?',
      },
    },
    roles: {
      header: {
        title: 'Role Management',
        buttonNew: 'New Role',
      },
      table: {
        columnName: 'Role Name',
        columnDescription: 'Description',
        columnTenant: 'Tenant',
      },
      form: {
        labelName: 'Role Name',
        labelDescription: 'Description',
        labelTenant: 'Tenant',
      },
      permissions: {
        title: 'Role Permissions',
        empty: '(No permissions)',
      },
      confirm: {
        delete: 'Are you sure you want to delete this role?',
      },
    },
    modules: {
      header: {
        title: 'Module Management',
        buttonNew: 'New Module',
        titleEdit: 'Edit Module',
      },
      form: {
        labelName: 'Module Name',
        labelDisplayName: 'Display Name',
        labelRoute: 'Route',
        labelUrl: 'App URL',
        labelIcon: 'Icon',
        labelSortOrder: 'Sort Order',
      },
      features: {
        title: 'Features',
        buttonNew: 'New Feature',
      },
      confirm: {
        delete: 'Are you sure you want to delete this module?',
      },
    },
    features: {
      header: {
        title: 'Permission Management',
        titleBatch: 'Create from Template',
        buttonBatchApply: 'Apply Template',
        titleExisting: 'Existing Permissions',
        buttonNewCustom: 'New Custom Permission',
      },
      table: {
        columnCode: 'Code',
        columnType: 'Type',
        columnSuffix: 'Suffix (code suffix)',
        columnFullCode: 'Full Code',
      },
      form: {
        typeMenu: 'menu (page access)',
        typeButton: 'button (action)',
        typeApi: 'api (endpoint)',
        tplView: 'View',
        tplCreate: 'Create',
        tplUpdate: 'Update',
        tplDelete: 'Delete',
        tplExport: 'Export',
      },
      confirm: {
        delete: 'Are you sure you want to delete this permission?',
      },
    },
    auditLogs: {
      header: {
        title: 'Audit Logs',
      },
      filter: {
        placeholderSearch: 'Search resource...',
      },
      table: {
        columnTime: 'Time',
        columnOperator: 'Operator',
        columnAction: 'Action',
        columnResource: 'Resource',
        columnIp: 'IP',
      },
    },
    profile: {
      header: {
        title: 'Profile Settings',
      },
      name: {
        title: 'Update Display Name',
        labelDisplayName: 'Display Name',
        buttonUpdate: 'Update',
        successUpdated: 'Display name updated',
      },
      password: {
        title: 'Change Password',
        labelOldPassword: 'Current Password',
        labelNewPassword: 'New Password',
        buttonChange: 'Change Password',
        successUpdated: 'Password updated',
      },
    },
    errors: {
      page: {
        notFound: 'Page not found',
        forbidden: 'You do not have access to this feature',
        buttonGoHome: 'Go Home',
        moduleNotFound: 'Module not found or disabled.',
      },
    },
    moduleNames: {
      display: {
        tenants: 'Tenants',
        users: 'Users',
        rbac: 'Permissions',
        audit: 'Audit Logs',
        settings: 'Settings',
        cert: 'Certificate Management',
      } as Record<string, string>,
    },
    featureNames: {
      display: {
        'tenant-list': 'Tenant List',
        'user-list': 'User List',
        'role-list': 'Role Management',
        'audit-log': 'Audit Log',
        'cert-toolbox': 'Certificate Toolbox',
        'cert-list': 'Certificate List',
      } as Record<string, string>,
    },
  },
} as const

export default en

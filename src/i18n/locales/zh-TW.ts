const zhTW = {
  shared: {
    common: {
      action: {
        save: '儲存',
        cancel: '取消',
        create: '建立',
        delete: '刪除',
        edit: '編輯',
        search: '查詢',
        back: '返回',
      },
      status: {
        enabled: '啟用',
        disabled: '停用',
        loading: '載入中...',
      },
      label: {
        actions: '操作',
        status: '狀態',
        name: '名稱',
        description: '說明',
        tenantCode: '租戶代碼',
      },
      confirm: {
        delete: '確定刪除？',
      },
      error: {
        createFailed: '建立失敗',
        updateFailed: '更新失敗',
      },
    },
  },
  hyadmin: {
    header: {
      nav: {
        title: 'HySP Console',
        admin: '系統管理',
        profile: '個人設定',
        logout: '登出',
      },
    },
    sidebar: {
      nav: {
        groupAccounts: '帳號權限',
        groupSystem: '系統設定',
        users: '使用者管理',
        roles: '角色管理',
        modules: '模組管理',
        auditLogs: '稽核日誌',
        selectModule: '請從頂部選擇模組',
      },
    },
    breadcrumb: {
      nav: {
        home: '首頁',
        admin: '管理設定',
        users: '使用者管理',
        roles: '角色管理',
        modules: '模組管理',
        auditLogs: '稽核日誌',
        features: '功能設定',
        new: '新增',
      },
    },
    login: {
      header: {
        title: 'HySP Admin',
        subtitle: '管理員登入',
      },
      form: {
        labelTenantCode: '租戶代碼',
        labelUsername: '帳號',
        labelPassword: '密碼',
        buttonSubmit: '登入',
      },
      error: {
        failed: '登入失敗',
      },
    },
    dashboard: {
      header: {
        title: 'Dashboard',
        hint: '選擇左側選單以載入模組。',
      },
    },
    users: {
      header: {
        title: '使用者管理',
        buttonNew: '新增使用者',
      },
      table: {
        columnUsername: '帳號',
        columnDisplayName: '顯示名稱',
        columnEmail: 'Email',
        columnTenant: '租戶',
        columnProvider: '登入方式',
      },
      form: {
        labelUsername: '帳號',
        labelDisplayName: '顯示名稱',
        labelEmail: 'Email',
        labelTenant: '租戶',
        labelProvider: '登入方式',
      },
      confirm: {
        delete: '確定刪除此使用者？',
      },
    },
    roles: {
      header: {
        title: '角色管理',
        buttonNew: '新增角色',
      },
      table: {
        columnName: '角色名稱',
        columnDescription: '說明',
        columnTenant: '租戶',
      },
      form: {
        labelName: '角色名稱',
        labelDescription: '說明',
        labelTenant: '租戶',
      },
      permissions: {
        title: '角色授權設定',
        empty: '（無授權點）',
      },
      confirm: {
        delete: '確定刪除此角色？',
      },
    },
    modules: {
      header: {
        title: '模組管理',
        buttonNew: '新增模組',
        titleEdit: '編輯模組',
      },
      form: {
        labelName: '模組名稱',
        labelDisplayName: '顯示名稱',
        labelRoute: '路由',
        labelUrl: '子應用 URL',
        labelIcon: '圖示',
        labelSortOrder: '排序',
      },
      features: {
        title: '功能列表',
        buttonNew: '新增功能',
      },
      confirm: {
        delete: '確定刪除此模組？',
      },
    },
    features: {
      header: {
        title: '授權點管理',
        titleBatch: '從範本建立授權點',
        buttonBatchApply: '套用範本',
        titleExisting: '現有授權點',
        buttonNewCustom: '新增自訂授權點',
      },
      table: {
        columnCode: 'Code',
        columnType: '類型',
        columnSuffix: 'Suffix（code後綴）',
        columnFullCode: '完整 Code',
      },
      form: {
        typeMenu: 'menu（頁面存取）',
        typeButton: 'button（操作按鈕）',
        typeApi: 'api（API 端點）',
        tplView: '頁面存取',
        tplCreate: '新增',
        tplUpdate: '編輯',
        tplDelete: '刪除',
        tplExport: '匯出',
      },
      confirm: {
        delete: '確定刪除此授權點？',
      },
    },
    auditLogs: {
      header: {
        title: '操作稽核日誌',
      },
      filter: {
        placeholderSearch: '搜尋資源...',
      },
      table: {
        columnTime: '時間',
        columnOperator: '操作者',
        columnAction: '動作',
        columnResource: '資源',
        columnIp: 'IP',
      },
    },
    profile: {
      header: {
        title: '個人設定',
      },
      name: {
        title: '更新顯示名稱',
        labelDisplayName: '顯示名稱',
        buttonUpdate: '更新',
        successUpdated: '顯示名稱已更新',
      },
      password: {
        title: '修改密碼',
        labelOldPassword: '目前密碼',
        labelNewPassword: '新密碼',
        buttonChange: '變更密碼',
        successUpdated: '密碼已更新',
      },
    },
    errors: {
      page: {
        notFound: '找不到此頁面',
        forbidden: '您沒有存取此功能的權限',
        buttonGoHome: '回首頁',
        moduleNotFound: '模組未找到或未啟用。',
      },
    },
    moduleNames: {
      display: {
        tenants: '租戶管理',
        users: '使用者管理',
        rbac: '權限管理',
        audit: '稽核日誌',
        settings: '系統設定',
        cert: '憑證管理',
      } as Record<string, string>,
    },
    featureNames: {
      display: {
        'tenant-list': '租戶列表',
        'user-list': '使用者列表',
        'role-list': '角色管理',
        'audit-log': '稽核日誌',
        'cert-toolbox': '憑證工具箱',
        'cert-list': '憑證列表',
      } as Record<string, string>,
    },
  },
} as const

export default zhTW

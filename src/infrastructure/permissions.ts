export const PERMISSION_AUTH_AUTHORIZED = 'auth_authorized';

export const PERMISSION_AUTH_MANAGE_ROLES_VIEW = 'auth_manage_roles_view';
export const PERMISSION_AUTH_MANAGE_ROLES_EDIT = 'auth_manage_roles_edit';

export default [
    {
        id: PERMISSION_AUTH_MANAGE_ROLES_VIEW,
        label: 'Просмотр ролей пользователей',
        items: [
            {
                id: PERMISSION_AUTH_MANAGE_ROLES_EDIT,
                label: 'Редактирование ролей пользователей',
            },
        ],
    },
];

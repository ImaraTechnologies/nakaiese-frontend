import * as Yup from 'yup';

// --- Initial Values ---
export const PASSWORD_INITIAL_VALUES = {
    old_password: '',
    new_password: '',
    re_new_password: ''
};

export const DELETE_ACCOUNT_INITIAL_VALUES = {
    current_password: ''
};

// --- Validation Schemas ---
// We wrap these in functions so we can pass the 't' (translation) function
export const getPasswordSchema = (t) => {
    return Yup.object({
        old_password: Yup.string()
            .required(t('validation.required')),
        new_password: Yup.string()
            .min(8, t('validation.min_length'))
            .required(t('validation.required')),
        re_new_password: Yup.string()
            .oneOf([Yup.ref('new_password'), null], t('validation.password_match'))
            .required(t('validation.required'))
    });
};

export const getDeleteAccountSchema = (t) => {
    return Yup.object({
        current_password: Yup.string()
            .required(t('validation.required'))
    });
};
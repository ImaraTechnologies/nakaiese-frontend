'use client'

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useFormik } from 'formik';
import { ChevronRight, Lock, Trash2, Shield, LogOut, Loader2, AlertTriangle, X } from 'lucide-react';

// Hooks & Context
import { useSecurity } from '@/hooks/useSecurity';
import { useAuth } from '@/context/AuthContext';

// Components
import Modal from '@/components/Shared/Modal/Modal'; // Ensure path is correct
import SecurityRow from '@/components/Shared/Profile/SecurityRow'; // Ensure path is correct

// ✅ Config Imports
import {
    getPasswordSchema,
    getDeleteAccountSchema,
    PASSWORD_INITIAL_VALUES,
    DELETE_ACCOUNT_INITIAL_VALUES
} from '@/validations/securitySchemas';

export default function SecurityPage() {
    const t = useTranslations('Security');
    const { logout } = useAuth();

    const {
        changePassword,
        isChangingPassword,
        changePasswordError,
        deleteAccount,
        isDeleting,
        deleteError
    } = useSecurity();

    // Modal States
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    // --- 1. CHANGE PASSWORD FORM ---
    const passwordFormik = useFormik({
        initialValues: PASSWORD_INITIAL_VALUES,
        validationSchema: getPasswordSchema(t), // ✅ Pass 't' to schema
        onSubmit: async (values, { resetForm }) => {
            try {
                await changePassword(values);
                resetForm();
                setPasswordModalOpen(false);
            } catch (err) {
                // Error handled by hook state
            }
        }
    });

    // --- 2. DELETE ACCOUNT FORM ---
    const deleteFormik = useFormik({
        initialValues: DELETE_ACCOUNT_INITIAL_VALUES,
        validationSchema: getDeleteAccountSchema(t), // ✅ Pass 't' to schema
        onSubmit: async (values) => {
            try {
                await deleteAccount(values.current_password);
            } catch (err) {
                // Error handled by hook state
            }
        }
    });

    return (
        <div className="max-w-4xl mx-auto px-4">

            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">{t('title')}</h2>
                <p className="text-gray-500 mt-1">{t('subtitle')}</p>
            </div>

            {/* Content List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">

                <SecurityRow
                    icon={Lock}
                    title={t('change_password.title')}
                    description={t('change_password.desc')}
                    actionLabel={t('actions.change')}
                    onClick={() => setPasswordModalOpen(true)}
                />

                <SecurityRow
                    icon={Shield}
                    title={t('two_factor.title')}
                    description={t('two_factor.desc')}
                    actionLabel={t('actions.setup')}
                    onClick={() => alert("2FA Setup Coming Soon")}
                />

                <SecurityRow
                    icon={LogOut}
                    title={t('sessions.title')}
                    description={t('sessions.desc')}
                    actionLabel={t('actions.logout_all')}
                    onClick={() => {
                        if (confirm(t('sessions.confirm'))) logout();
                    }}
                />

                {/* Delete Row */}
                <div className="p-6 flex items-center justify-between hover:bg-red-50/30 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                            <Trash2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{t('delete_account.title')}</h3>
                            <p className="text-sm text-gray-500 mt-1">{t('delete_account.desc')}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setDeleteModalOpen(true)}
                        className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        {t('actions.delete')}
                    </button>
                </div>
            </div>

            {/* ================= MODALS ================= */}

            {/* 1. Password Modal */}
            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
                title={t('change_password.modal_title')}
            >
                <form onSubmit={passwordFormik.handleSubmit} className="space-y-4">
                    {changePasswordError && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            {t('errors.generic')}
                        </div>
                    )}

                    <InputGroup
                        label={t('labels.current_password')}
                        name="old_password"
                        type="password"
                        formik={passwordFormik}
                    />
                    <InputGroup
                        label={t('labels.new_password')}
                        name="new_password"
                        type="password"
                        formik={passwordFormik}
                    />
                    <InputGroup
                        label={t('labels.re_new_password')}
                        name="re_new_password"
                        type="password"
                        formik={passwordFormik}
                    />

                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setPasswordModalOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium">
                            {t('actions.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isChangingPassword || !passwordFormik.isValid}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isChangingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                            {t('actions.save')}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* 2. Delete Account Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title={t('delete_account.modal_title')}
            >
                <div className="text-center mb-6">
                    <div className="inline-flex p-3 bg-red-100 text-red-600 rounded-full mb-4">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{t('delete_account.warning_title')}</h3>
                    <p className="text-sm text-gray-500 mt-2">
                        {t('delete_account.warning_desc')}
                    </p>
                </div>

                <form onSubmit={deleteFormik.handleSubmit} className="space-y-4">
                    {deleteError && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            {t('errors.password_incorrect')}
                        </div>
                    )}

                    <InputGroup
                        label={t('labels.confirm_password')}
                        name="current_password"
                        type="password"
                        placeholder={t('placeholders.enter_password')}
                        formik={deleteFormik}
                    />

                    <button
                        type="submit"
                        disabled={isDeleting || !deleteFormik.isValid}
                        className="w-full py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {t('actions.confirm_delete')}
                    </button>
                </form>
            </Modal>
        </div>
    );
}



const InputGroup = ({ label, name, type, formik, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values[name]}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${formik.touched[name] && formik.errors[name] ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'
                }`}
        />
        {formik.touched[name] && formik.errors[name] && (
            <p className="mt-1 text-xs text-red-600">{formik.errors[name]}</p>
        )}
    </div>
);
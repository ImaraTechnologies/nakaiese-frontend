"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from 'next-intl';

const SignInBanner = () => {
    const t = useTranslations();


    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-5 sm:p-6 rounded-xl shadow-md w-full px-2 mb-12">
            <div className="flex flex-col gap-2 text-center sm:text-left">
                {/* Title with split styling */}
                <h3 className="text-md sm:text-lg font-semibold text-gray-900">
                    {t('SignInBanner.title_part1')} <span className="text-blue-600 font-bold">{t('SignInBanner.title_part2')}</span>
                </h3>

                <p className="text-sm text-gray-600 max-w-md">
                    {t('SignInBanner.description')}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base px-4 py-2 rounded-md transition">
                        {t('SignInBanner.signin_btn')}
                    </button>

                    <Link
                        href="#"
                        className="text-blue-600 hover:underline font-medium text-sm sm:text-base"
                    >
                        {t('SignInBanner.register_link')}
                    </Link>
                </div>
            </div>

            <div className="shrink-0">
                <Image
                    src="/Images/Logo.svg"
                    alt="Nakiese Logo"
                    width={100}
                    height={100}
                    priority
                    className="object-contain"
                />
            </div>
        </div>
    );
};

export default SignInBanner;
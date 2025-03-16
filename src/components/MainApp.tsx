"use client";
import { useCallback, useEffect, useState } from "react";
import { EnvCheck } from "../app/types/env";
import checkEnv from "../app/actions/envChecker";

export default function MainApp({ children }: Readonly<{ children: React.ReactNode }>) {
    const [errors, setErrors] = useState<EnvCheck["errors"]>([]);

    const fetchEnvErrors = useCallback(async () => {
        const payload = await checkEnv();
        setErrors(payload);
    }, [checkEnv, setErrors]);

    useEffect(() => {
        fetchEnvErrors();
    }, [fetchEnvErrors]);

    if (errors && errors.length > 0) {
        return (
            <div className="bg-[#171717] p-7 shadow-lg shadow-gray-900/10 sm:flex-none rounded-2xl w-full ">
                <div className="p-4 sm:p-10 text-center overflow-y-auto">
                    <span className="mb-4 inline-flex justify-center items-center size-[46px] rounded-full border-4 dark:bg-orange-700 dark:border-orange-600 dark:text-orange-100">
                        <svg className="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
                        </svg>
                    </span>

                    <h3 id="hs-task-created-alert-label" className="mb-2 text-xl font-bold text-neutral-200">
                        Il semblerait que votre .env ne soit pas totalement défini.
                    </h3>
                    <p className="text-neutral-500">Une erreur de configuration dans votre .env à été détecté</p>
                    {errors.map((error, index) => (
                        <ul key={index} className="text-neutral-500 space-y-3 mt-10">
                            <li className="flex justify-center  gap-x-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="shrink-0 size-4 mt-1 text-orange-500"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                                    <path d="M12 8v4" />
                                    <path d="M12 16h.01" />
                                </svg>

                                <span>{error.error_description}</span>
                            </li>
                        </ul>
                    ))}
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Footer from "#components/layout/Footer";
import Header from "#components/layout/Header";
import Alert, { AlertType } from "#components/alert/Alert";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Locked",
    description: "Control your web browsing",
};

interface EnvCheck {
    errors?: { error_title: string; error_description: string; env_key: string }[];
}

const checkRequiredEnv = () => {
    const requiredEnv = ["CONTROLD_API_KEY", "CONTROLD_PROFILE_ID", "BYPASS_OPT_ENV_CHECK"];
    const errors: EnvCheck["errors"] = [];

    for (const required of requiredEnv) {
        const envValue = process.env[required];

        if (!envValue || envValue.trim() === "") {
            errors.push({
                env_key: required.toUpperCase(),
                error_description: `La variable ${required.toUpperCase()} n'est pas défini.`,
                error_title: "Variable manquante",
            });
        }
    }

    return errors;
};

const checkOptionalEnv = () => {
    const optionalEnv = ["VIRUSTOTAL_API_KEY"];
    const errors: EnvCheck["errors"] = [];

    for (const optional of optionalEnv) {
        const envValue = process.env[optional];

        if (!envValue || envValue.trim() === "") {
            errors.push({
                env_key: optional.toUpperCase(),
                error_description: `La variable ${optional.toUpperCase()} n'est pas défini.`,
                error_title: "Variable optionnel manquante",
            });
        }
    }

    return errors;
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const requiredEnv = checkRequiredEnv();
    const optionalEnv = process.env.BYPASS_OPT_ENV_CHECK !== "true" ? checkOptionalEnv() : null;

    return (
        <html lang="fr">
            <body
                className={`${geistSans.variable} ${geistMono.variable} h-full antialiased font-[family-name:var(--font-geist-sans)] min-h-full px-6 py-12 lg:px-0 max-w-[35rem] flex-col justify-center flex mx-auto md:gap-8 gap-6`}
            >
                <Header />

                {optionalEnv
                    ? optionalEnv.map((optional) => (
                          <Alert
                              key={optional.env_key}
                              props={{
                                  type: AlertType.WARNING,
                                  title: optional.error_title,
                                  message: optional.error_description,
                              }}
                          ></Alert>
                      ))
                    : null}

                <Toaster position="bottom-center" />

                {requiredEnv.length > 0 ? (
                    <div className="bg-[#171717] p-7 shadow-lg shadow-gray-900/10 sm:flex-none rounded-2xl w-full ">
                        <div className="p-4 sm:p-10 text-center overflow-y-auto">
                            <span className="mb-4 inline-flex justify-center items-center size-[46px] rounded-full border-4 dark:bg-orange-700 dark:border-orange-600 dark:text-orange-100">
                                <svg
                                    className="shrink-0 size-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
                                </svg>
                            </span>

                            <h3 id="hs-task-created-alert-label" className="mb-2 text-xl font-bold text-neutral-200">
                                Il semblerait que votre .env ne soit pas totalement défini.
                            </h3>
                            <p className="text-neutral-500">Une erreur de configuration dans votre .env à été détecté</p>
                            {requiredEnv.map((error, index) => (
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
                ) : (
                    children
                )}
                <Footer />
            </body>
        </html>
    );
}

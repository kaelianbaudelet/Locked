import React, { useState, useEffect } from "react";
import PercentageCircle from "@/src/components/PercentageCircle";

interface VendorResult {
    result: "safe" | "unsafe" | null;
    vendor: string;
}

interface WebsiteSecurityCardProps {
    website: string;
}
export default function WebsiteSecurityCard({ props }: { props: WebsiteSecurityCardProps }) {
    const [loading, setLoading] = useState(true);
    const [securityPercentage, setSecurityPercentage] = useState<number>(0);
    const [safeVendors, setSafeVendors] = useState<number>(0);
    const [unsafeVendors, setUnsafeVendors] = useState<number>(0);
    const [result, setResult] = useState<{ [vendorName: string]: VendorResult } | null>(null);
    const [error, setError] = useState<{ isError: boolean; title: string; message: string } | null>(null);

    const website = props.website;

    const fetchWebsiteSafety = async (website: string) => {
        setLoading(true); // Commence le chargement
        try {
            const response = await fetch("/api/websafety", {
                next: { revalidate: 3600 }, // Revalider toutes les heures
                cache: "force-cache",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ website }),
            });

            if (!response.ok) {
                switch (response.status) {
                    case 503:
                        setError({
                            isError: true,
                            title: "Websafety désactivé",
                            message: "Le service de websafety n'est pas disponible ou actif.",
                        });
                        throw new Error("Le service de websafety n'est pas disponible ou actif.");
                    case 400:
                        setError({
                            isError: true,
                            title: "URL invalide",
                            message: "Websafety n'est pas pu utiliser l'URL renseigné.",
                        });
                        throw new Error("URL invalide. Veuillez saisir une URL valide.");
                    case 500:
                        setError({
                            isError: true,
                            title: "Erreur interne",
                            message: "Websafety n'est pas disponible.",
                        });
                        throw new Error("Erreur interne du serveur. Veuillez réessayer plus tard.");
                    case 429:
                        setError({
                            isError: true,
                            title: "Trop de demandes en cours",
                            message: "Websafety est temporairement désactivé suite à une trop grande utilisation.",
                        });
                        throw new Error("Trop de requêtes. Veuillez réessayer plus tard.");
                    default:
                        setError({
                            isError: true,
                            title: "Erreur interne",
                            message: "Websafety n'est pas disponible.",
                        });
                        throw new Error("Erreur lors de la récupération des données");
                }
            }

            const data = await response.json();
            setResult(data); // Stocker les résultats reçus
            setLoading(false); // Arrêter le chargement une fois que les données sont reçues
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
            console.error(`Erreur: ${errorMessage}`);
        }
    };

    useEffect(() => {
        if (website) {
            fetchWebsiteSafety(website);
        }
    }, [website]);

    useEffect(() => {
        if (result) {
            const filteredResults = Object.values(result).filter((vendorResult: VendorResult) => vendorResult.result !== null);
            const safeCount = filteredResults.filter((v) => v.result === "safe").length;
            const unsafeCount = filteredResults.filter((v) => v.result === "unsafe").length;

            setSafeVendors(safeCount);
            setUnsafeVendors(unsafeCount);

            const percentage = Math.max(0, 100 - unsafeCount * 10);
            setSecurityPercentage(Math.round(percentage));
        }
    }, [result]);

    // Déterminer le message de sécurité
    let securityMessage;
    if (unsafeVendors > 2) {
        securityMessage = (
            <p className="text-white sm:text-sm text-[0.7rem] font-medium text-balance">
                Ce site semble dangereux, d'après <span className="font-bold">{unsafeVendors || 0}</span> services
            </p>
        );
    } else {
        securityMessage = (
            <p className="text-white sm:text-sm text-[0.7rem] font-medium text-balance">
                Ce site semble fiable, d'après <span className="font-bold">{safeVendors || 0}</span> services
            </p>
        );
    }

    // Déterminer le message de conseil
    let adviceMessage;
    if (securityPercentage >= 70) {
        adviceMessage = (
            <div className="text-white leading-relaxed rounded-xl font-semibold text-xs">
                <svg
                    className="mr-2 flex-shrink-0 w-4 h-4 inline align-middle"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M3.37752 5.08241C3 5.62028 3 7.21907 3 10.4167V11.9914C3 17.6294 7.23896 20.3655 9.89856 21.5273C10.62 21.8424 10.9807 22 12 22C13.0193 22 13.38 21.8424 14.1014 21.5273C16.761 20.3655 21 17.6294 21 11.9914V10.4167C21 7.21907 21 5.62028 20.6225 5.08241C20.245 4.54454 18.7417 4.02996 15.7351 3.00079L15.1623 2.80472C13.595 2.26824 12.8114 2 12 2C11.1886 2 10.405 2.26824 8.83772 2.80472L8.26491 3.00079C5.25832 4.02996 3.75503 4.54454 3.37752 5.08241ZM15.0595 10.4995C15.3353 10.1905 15.3085 9.71642 14.9995 9.44055C14.6905 9.16467 14.2164 9.19151 13.9405 9.50049L10.9286 12.8739L10.0595 11.9005C9.78358 11.5915 9.30947 11.5647 9.00049 11.8405C8.69151 12.1164 8.66467 12.5905 8.94055 12.8995L10.3691 14.4995C10.5114 14.6589 10.7149 14.75 10.9286 14.75C11.1422 14.75 11.3457 14.6589 11.488 14.4995L15.0595 10.4995Z"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        fill="#fff"
                    />
                </svg>
                Site sécurisé. Ce site ne présente aucun risque identifié. Vous pouvez naviguer en toute tranquillité, mais restez vigilant face aux contenus ou
                liens suspects.
            </div>
        );
    } else if (securityPercentage >= 50) {
        adviceMessage = (
            <div className="text-white leading-relaxed rounded-xl font-semibold text-xs">
                <svg
                    className="mr-2 flex-shrink-0 w-4 h-4 inline align-middle"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3 10.4167C3 7.21907 3 5.62028 3.37752 5.08241C3.75503 4.54454 5.25832 4.02996 8.26491 3.00079L8.83772 2.80472C10.405 2.26824 11.1886 2 12 2C12.8114 2 13.595 2.26824 15.1623 2.80472L15.7351 3.00079C18.7417 4.02996 20.245 4.54454 20.6225 5.08241C21 5.62028 21 7.21907 21 10.4167V11.9914C21 17.6294 16.761 20.3655 14.1014 21.5273C13.38 21.8424 13.0193 22 12 22C10.9807 22 10.62 21.8424 9.89856 21.5273C7.23896 20.3655 3 17.6294 3 11.9914V10.4167ZM12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V12C12.75 12.4142 12.4142 12.75 12 12.75C11.5858 12.75 11.25 12.4142 11.25 12V8C11.25 7.58579 11.5858 7.25 12 7.25ZM12 16C12.5523 16 13 15.5523 13 15C13 14.4477 12.5523 14 12 14C11.4477 14 11 14.4477 11 15C11 15.5523 11.4477 16 12 16Z"
                        fill="#fff"
                    ></path>
                </svg>
                Risque modéré. Accédez avec prudence, utilisez un antivirus à jour, ne partagez pas d&apos;infos sensibles, et soyez vigilant face aux contenus
                ou liens suspects.
            </div>
        );
    } else {
        adviceMessage = (
            <div className="text-white leading-relaxed rounded-xl font-semibold text-xs">
                <svg
                    className="mr-2 flex-shrink-0 w-4 h-4 inline align-middle"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3 10.4167C3 7.21907 3 5.62028 3.37752 5.08241C3.75503 4.54454 5.25832 4.02996 8.26491 3.00079L8.83772 2.80472C10.405 2.26824 11.1886 2 12 2C12.8114 2 13.595 2.26824 15.1623 2.80472L15.7351 3.00079C18.7417 4.02996 20.245 4.54454 20.6225 5.08241C21 5.62028 21 7.21907 21 10.4167V11.9914C21 17.6294 16.761 20.3655 14.1014 21.5273C13.38 21.8424 13.0193 22 12 22C10.9807 22 10.62 21.8424 9.89856 21.5273C7.23896 20.3655 3 17.6294 3 11.9914V10.4167ZM12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V12C12.75 12.4142 12.4142 12.75 12 12.75C11.5858 12.75 11.25 12.4142 11.25 12V8C11.25 7.58579 11.5858 7.25 12 7.25ZM12 16C12.5523 16 13 15.5523 13 15C13 14.4477 12.5523 14 12 14C11.4477 14 11 14.4477 11 15C11 15.5523 11.4477 16 12 16Z"
                        fill="#fff"
                    ></path>
                </svg>
                Accès risqué. Ce site est identifié comme dangereux. Évitez de le visiter, n'entrez pas d'informations sensibles pour éviter les menaces
                potentielles comme les virus ou le vol de données.
            </div>
        );
    }

    return (
        <div className="bg-[#171717] p-7 shadow-lg shadow-gray-900/10 sm:flex-none rounded-2xl w-full ">
            {error ? (
                <div className="p-4 sm:p-10 text-center overflow-y-auto">
                    <span className="mb-4 inline-flex justify-center items-center size-[46px] rounded-full border-4 dark:bg-orange-700 dark:border-orange-600 dark:text-orange-100">
                        <svg className="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
                        </svg>
                    </span>

                    <h3 id="hs-task-created-alert-label" className="mb-2 text-xl font-bold text-neutral-200">
                        {error.title}
                    </h3>
                    <p className="text-neutral-500">{error.message}</p>
                </div>
            ) : (
                <div>
                    <h1 className="font-semibold text-white md:text-xl text-sm mb-4">Analyse de sécurité du site</h1>
                    <div className="relative w-full flex flex-col gap-6">
                        <div className="w-full flex flex-col gap-4">
                            <div className="flex w-full md:gap-6 gap-4 h-full">
                                <PercentageCircle props={{ loading: loading, percentage: securityPercentage }} />
                                <div className="h-full flex justify-center flex-col my-auto md:gap-2 gap-1 transition-all duration-200 w-full">
                                    {loading ? (
                                        <div className="bg-[#a8a8a8]/10 h-6 rounded-md animate-pulse mb-1 w-1/4"></div>
                                    ) : (
                                        <h2 className="text-white md:text-xl text-sm font-bold font-heading break-all">{website}</h2>
                                    )}

                                    {loading ? <div className="bg-[#a8a8a8]/10 h-5 rounded-md animate-pulse w-1/2"></div> : securityMessage}
                                    {loading ? (
                                        <div className="bg-[#a8a8a8]/10 h-4 rounded-md animate-pulse w-1/4"></div>
                                    ) : (
                                        <span className="text-[0.6rem] text-[#a8a8a8]">
                                            Site analysé par
                                            <a href="https://www.virustotal.com" target="_blank">
                                                <svg
                                                    className="mx-1 flex-shrink-0 h-4 inline align-middle"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 564.3 109"
                                                >
                                                    <path
                                                        fill="#fff"
                                                        d="m158.6 78.7-17.1-48.6h8.9c10.5 30.5 11.9 34.8 13 38.6 1-3.5 2.6-8.2 13.5-38.6h8.9l-17.9 48.6h-9.3zM194.2 78.7V30.2h8.3v48.5zM299.6 58.3c0 6.6-.6 10.8-2.4 13.9-2.8 4.9-8.7 7.6-17.3 7.6-8.1 0-14.1-2.4-16.9-7.8-1.7-3.1-2.3-7.7-2.3-13.2V30.2h8.3v28.4c0 4 .3 6.8 1 8.6 1.2 3.1 4.2 5.5 10.3 5.5 5.3 0 8.5-1.8 10.1-5.1.8-1.7 1.6-4.9 1.6-8.9V30.2h7.6v28.1zM310.1 69.4c3.7 1.7 8.5 3.3 14.1 3.3 6.6 0 10-2.4 10-6.7 0-3.3-1.2-5.1-7.6-7.3l-6.8-2.3c-7.1-2.4-10.4-6.6-10.4-13.5 0-7.4 5.8-13.9 18.3-13.9 4.9 0 9.7.8 13.6 2.2l-1.8 6.9c-4-1.3-8.8-2.2-12.8-2.2-6.7 0-8.6 3.5-8.6 6.4 0 2.9.9 4.9 6.5 6.7l6.8 2.4c8.3 2.8 11.2 7.2 11.2 13.5 0 7.7-5.3 14.6-18.4 14.6-6.1 0-12-1.4-16.2-3.4l2.1-6.7zM365.5 78.7V37.8H351v-7.6h37.4v7.6h-14.5v40.9zM452.2 78.7V37.8h-14.5v-7.6h37.4v7.6h-14.5v40.9zM412 79.7c-14.1 0-23-11.8-23-25.8 0-15.4 9-24.8 24.2-24.8 14.6 0 22.2 11.3 22.3 24.8.1 13.9-8.7 25.8-23.5 25.8zm.6-43.6c-9.6 0-14.8 6-14.8 17.9 0 14.5 6.3 18.7 14.6 18.7 8.6 0 14.4-5.3 14.4-18.3.2-11.5-3.1-18.3-14.2-18.3zM473.4 78.7l18.7-48.6h9.6l18.2 48.6H511L506.1 66h-18.9l-5 12.8h-8.8zm30.5-19.8c-4.5-12.5-6-16.5-7-19.9-1.1 3.3-2.4 7.1-7.4 19.9h14.4zM527.9 78.7V30.2h9v41.2l24.2-.3.1 7.6zM0 5.9l48.7 48.6L0 103h107.5V5.9H0zm97.1 86.7H24.5l38.4-38.1-38.4-38.2h72.6v76.3zM240.8 57.7c7.2-2.4 10-7.5 10-13.7 0-6.7-3.5-10.9-8.6-12.5-3-.9-7.3-1.3-11.5-1.3h-15v48.6h8.3V58.9l2.8-.2c3.7 0 5.5.4 6.3.3L244 78.7h9.2l-12.4-21zm-2.2-6.6c-2 1.1-4.9 1.4-8.4 1.4H224V37.1h6.3c3.3 0 5.8.1 7.7.8 2.6 1 4 3.3 4 6.6-.1 3-1.2 5.4-3.4 6.6z"
                                                    ></path>
                                                </svg>
                                            </a>
                                        </span>
                                    )}
                                </div>
                            </div>
                            {loading ? (
                                <div className="bg-[#a8a8a8]/10 h-11 rounded-xl animate-pulse w-full"></div>
                            ) : (
                                <div
                                    className={`inline-block px-4 py-3 w-full rounded-xl ${
                                        securityPercentage >= 70 ? "bg-green-500" : securityPercentage >= 50 ? "bg-yellow-500" : "bg-red-500"
                                    }`}
                                >
                                    {adviceMessage}
                                </div>
                            )}

                            <ul className="flex flex-wrap text-base lg:text-lg mx-auto w-full pl-4">
                                {result &&
                                    Object.values(result)
                                        .filter((vendorResult) => vendorResult.result !== null)
                                        .map((vendorResult: VendorResult) => (
                                            <li key={vendorResult.vendor} className="w-1/2 lg:w-1/4 mb-2 flex items-center gap-2 justify-start truncate">
                                                <svg
                                                    className={`flex-shrink-0 ${vendorResult.result === "safe" ? "fill-green-500" : "fill-red-500"}`}
                                                    width="18px"
                                                    height="18px"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    {vendorResult.result === "safe" ? (
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M3.37752 5.08241C3 5.62028 3 7.21907 3 10.4167V11.9914C3 17.6294 7.23896 20.3655 9.89856 21.5273C10.62 21.8424 10.9807 22 12 22C13.0193 22 13.38 21.8424 14.1014 21.5273C16.761 20.3655 21 17.6294 21 11.9914V10.4167C21 7.21907 21 5.62028 20.6225 5.08241C20.245 4.54454 18.7417 4.02996 15.7351 3.00079L15.1623 2.80472C13.595 2.26824 12.8114 2 12 2C11.1886 2 10.405 2.26824 8.83772 2.80472L8.26491 3.00079C5.25832 4.02996 3.75503 4.54454 3.37752 5.08241ZM15.0595 10.4995C15.3353 10.1905 15.3085 9.71642 14.9995 9.44055C14.6905 9.16467 14.2164 9.19151 13.9405 9.50049L10.9286 12.8739L10.0595 11.9005C9.78358 11.5915 9.30947 11.5647 9.00049 11.8405C8.69151 12.1164 8.66467 12.5905 8.94055 12.8995L10.3691 14.4995C10.5114 14.6589 10.7149 14.75 10.9286 14.75C11.1422 14.75 11.3457 14.6589 11.488 14.4995L15.0595 10.4995Z"
                                                        />
                                                    ) : (
                                                        <path
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M3.37752 5.08241C3 5.62028 3 7.21907 3 10.4167V11.9914C3 17.6294 7.23896 20.3655 9.89856 21.5273C10.62 21.8424 10.9807 22 12 22C13.0193 22 13.38 21.8424 14.1014 21.5273C16.761 20.3655 21 17.6294 21 11.9914V10.4167C21 7.21907 21 5.62028 20.6225 5.08241C20.245 4.54454 18.7417 4.02996 15.7351 3.00079L15.1623 2.80472C13.595 2.26824 12.8114 2 12 2C11.1886 2 10.405 2.26824 8.83772 2.80472L8.26491 3.00079C5.25832 4.02996 3.75503 4.54454 3.37752 5.08241ZM10.0303 8.96965C9.73744 8.67676 9.26256 8.67676 8.96967 8.96965C8.67678 9.26254 8.67678 9.73742 8.96967 10.0303L10.9394 12L8.96969 13.9697C8.6768 14.2625 8.6768 14.7374 8.96969 15.0303C9.26258 15.3232 9.73746 15.3232 10.0304 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9696L13.0607 12L15.0303 10.0303C15.3232 9.73744 15.3232 9.26256 15.0303 8.96967C14.7374 8.67678 14.2626 8.67678 13.9697 8.96967L12 10.9393L10.0303 8.96965Z"
                                                        />
                                                    )}
                                                </svg>
                                                <p className="text-xs text-white font-semibold truncate">{vendorResult.vendor}</p>
                                            </li>
                                        ))}
                            </ul>

                            <div
                                className={`absolute font-semibold text-white h-full justify-center items-center w-full flex gap-4 flex-col bg-[#171717] ${
                                    !loading ? "hidden" : ""
                                }`}
                            >
                                <div className="spinner spinner-xl relative mx-auto"></div>
                                Analyse de sécurité en cours...
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

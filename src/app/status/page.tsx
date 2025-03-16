"use client";

import WebsiteSecurityCard from "@/src/components/website/WebsiteSecurityCard";
import WebsiteStateCard from "@/src/components/website/WebsiteStateCard";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Tabs, { TabLink } from "@/src/components/Tabs";

export default function Stats() {
    return (
        <Suspense fallback={<div>Loading search parameters...</div>}>
            <SearchParamsWrapper />
        </Suspense>
    );
}

function SearchParamsWrapper() {
    const searchParams = useSearchParams();
    const website = searchParams.get("w");

    const links: TabLink[] = [
        {
            name: "Analyse",
            pathname: `/action`,
            to: `/status?w=${website}`,
        },
        {
            name: "Abonnement",
            pathname: "/subscription",
        },
    ];

    return (
        <>
            <Tabs props={{ link: links }}>
                <div className="flex flex-col gap-5">
                    {website && <WebsiteStateCard props={{ website }} />}
                    {website && <WebsiteSecurityCard props={{ website }} />}
                </div>
            </Tabs>
        </>
    );
}

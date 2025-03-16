"use client";

import WebsiteBrowserCard from "@/src/components/website/WebsiteBrowserCard";
import Tabs, { TabLink } from "@/src/components/Tabs";

export default function Welcome() {
    const links: TabLink[] = [
        {
            name: "Analyse",
            pathname: "/",
        },
        {
            name: "Abonnement",
            pathname: "/subscription",
        },
    ];

    return (
        <>
            <Tabs props={{ link: links }}>
                <WebsiteBrowserCard />
            </Tabs>
        </>
    );
}

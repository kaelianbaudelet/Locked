"use client";

import React from "react";
import Tabs, { TabLink } from "@/src/components/Tabs";
import SubscriptionCard from "@/src/components/subscription/SubscriptionCard";

export default function Subscription() {
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
                <SubscriptionCard />
            </Tabs>
        </>
    );
}

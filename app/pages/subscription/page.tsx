"use client";

import React from "react";
import Tabs, { TabLink } from "#components/Tabs";
import SubscriptionCard from "#components/subscription/SubscriptionCard";

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

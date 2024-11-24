"use client";

import Logo from '@/app/components/logo';
import WebsiteSecurityCard from '@/app/components/website_security_card';
import WebsiteStateCard from '@/app/components/website_state_card';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const Stats: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading search parameters...</div>}>
            <SearchParamsWrapper />
        </Suspense>
    );
};

const SearchParamsWrapper: React.FC = () => {
    const searchParams = useSearchParams();
    const website = searchParams.get('w');

    return (
        <>
            <Logo />
            {website && <WebsiteStateCard website={website} />}
            {website && <WebsiteSecurityCard website={website} />}
        </>
    );
};

export default Stats;

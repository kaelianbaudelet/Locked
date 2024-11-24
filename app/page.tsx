"use client";

import Link from 'next/link'
import Greetings from '@/app/components/greetings';
import WebsiteBrowserCard from '@/app/components/website_browser_card';
import Logo from '@/app/components/logo';


export default function Home() {

return (
<>
      <Logo />
      <Greetings />
         <div className="inline-flex items-center p-2 bg-[#171717] rounded-2xl w-full font-semibold shadow-lg truncate">
            <Link href="/" className="inline-block text-center px-4 py-3 text-sm rounded-xl text-white bg-[#2f2f2f] w-1/2 truncate">Débloqué/Bloquer</Link>
            <Link href="/subscription" className="inline-block text-center px-4 py-3 text-sm rounded-xl text-[#a8a8a8] w-1/2 truncate">Abonnement</Link>
         </div>
      <WebsiteBrowserCard />
   </>
);
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TabContent({ children }: { children: React.ReactNode }) {
    return children;
}

export interface TabLink {
    name: string;
    pathname: string;
    to?: string;
}

interface Props {
    link: TabLink[];
}

export default function Tabs({ children, props }: { children: React.ReactNode; props: Props }) {
    const pathname = usePathname();
    const links = props.link;

    return (
        <>
            <div className="inline-flex items-center p-2 bg-[#171717] rounded-2xl w-full font-semibold shadow-lg truncate">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.to ? link.to : link.pathname}
                        className={`inline-block text-center px-4 py-3 text-sm rounded-xl ${
                            pathname === link.pathname ? "text-white bg-[#2f2f2f]" : "text-[#a8a8a8]"
                        } w-1/2 truncate`}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>
            <main>{children}</main>
        </>
    );
}

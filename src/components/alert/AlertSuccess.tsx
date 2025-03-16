import { AlertContent } from "./Alert";

export default function AlertSuccess({ props }: { props: AlertContent }) {
    return (
        <div className="border rounded-2xl p-4 bg-teal-800/10 border-teal-900 text-teal-500" role="alert" aria-labelledby="hs-with-description-label">
            <div className="flex">
                <div className="shrink-0">
                    <svg
                        className="shrink-0 size-4 mt-0.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                        <path d="M12 9v4"></path>
                        <path d="M12 17h.01"></path>
                    </svg>
                </div>
                <div className="ms-4">
                    <h3 id="hs-with-description-label" className="text-sm font-semibold">
                        {props.title}
                    </h3>
                    {props.message ? <div className="mt-1 text-sm text-teal-700">{props.message}</div> : null}
                </div>
            </div>
        </div>
    );
}

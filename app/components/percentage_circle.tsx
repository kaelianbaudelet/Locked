import React, { useEffect, useState } from 'react';

interface PercentageCircleProps {
    percentage?: number; // Rendre le pourcentage optionnel
    loading: boolean; // Ajoute une prop loading
}

const PercentageCircle: React.FC<PercentageCircleProps> = ({ percentage, loading }) => {
    const radius = 75;
    const circumference = 2 * Math.PI * radius;

    const [dashOffset, setDashOffset] = useState(circumference); // Commence avec le dashOffset à 100%

    const strokeClass =
        percentage && percentage > 70 ? 'stroke-green-500' :
        percentage && percentage >= 50 ? 'stroke-yellow-500' :
        'stroke-red-500';

    useEffect(() => {
        if (loading) {
            // Pendant le chargement, on garde le dashOffset à 100%
            setDashOffset(circumference);
        } else {
            // Après le chargement, on met un délai de 500 ms
            setTimeout(() => {
                setDashOffset(circumference - (percentage ? (percentage / 100) * circumference : circumference));
            }, 500);
        }
    }, [loading, percentage, circumference]);

    return (
        <div className="relative flex items-center justify-center md:w-32 md:h-32 h-20 w-20">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 160 160"
                width="110"
                height="110"
                className={`duration-200 ease-in-out transition-all md:w-28 md:h-28 w-16 h-16 ${loading ? 'animate-pulse' : ''} ${strokeClass}`}
            >
                <circle cx="80" cy="80" r="75" stroke="#262626" strokeWidth="5" fill="transparent"></circle>
                <path
                    d="M80,5A75,75,0,1,1,5,80,75,75,0,0,1,80,5"
                    strokeLinecap="round"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    style={{
                        transition: 'stroke-dashoffset 1s ease-in-out',
                    }}
                />
            </svg>
            <div className="absolute inset-0">
                <div className="flex flex-col items-center justify-center align-middle my-auto content-center h-full">
                    <div className="font-bold md:text-4xl text-sm mb-0 text-white">
                        {loading ? (
                            <div className="bg-[#a8a8a8]/10 md:h-8 h-3.5 md:rounded-md rounded-sm animate-pulse md:w-12 w-5 mb-1"></div>
                        ) : (
                            percentage
                        )}
                    </div>
                    <div className="text-[#a8a8a8] border-t border-[#a8a8a8]/20 md:text-lg text-xs">
                        {loading ? (
                            <div className="bg-[#a8a8a8]/10 md:h-5 h-2.5 md:rounded-md rounded-sm animate-pulse md:w-10 w-6 mt-1"></div>
                        ) : (
                            <p>100</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PercentageCircle;

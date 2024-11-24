"use client";

import React, { useEffect, useState } from 'react';

const StatsCard: React.FC = () => {
  const [subscriptionData, setSubscriptionData] = useState<{
    state: string;
    end_date: string;
    days_remaining: number;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour fetch les données de l'abonnement
  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch subscription data');
      }
      const data = await response.json();
      setSubscriptionData(data);
    } catch (error) {
      setError('Erreur lors de la récupération des données.');
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  if (error) {
    return <div className="text-white bg-red-500 inline-block px-4 py-4 w-full rounded-xl text-xs font-semibold">{error}</div>;
  }

  return (
    <div className="bg-[#171717] shadow-lg shadow-gray-900/10 sm:flex-none rounded-2xl w-full relative overflow-hidden">
      <div className={`absolute font-semibold text-white h-full justify-center items-center w-full rounded-2xl flex gap-4 flex-col bg-[#171717] ${!loading ? 'hidden' : ''}`}>
        <div className="spinner spinner-xl relative mx-auto"></div>
        Récupération de l&apos;abonnement...
      </div>
      <div className='p-7 rounded-2xl'>
      <h1 className='font-semibold text-white text-xl mb-6'>
        Information sur l&apos;abonnement à ControlD
      </h1>
      <div className="space-y-3">
        <dl className="flex flex-row gap-1">
          <dt className="md:min-w-40 min-w-20 flex items-center">
            <span className=" md:text-sm text-xs font-medium text-[#a8a8a8] break-all">Etat:</span>
          </dt>
          <dd>
            <ul className="items-center flex">
              <li className="my-auto gap-2 inline-flex justify-center items-center md:text-sm text-xs font-semibold text-white">
                {subscriptionData?.state === 'active' ? (
                  // SVG Bouclier Vert
                  <svg className="flex-shrink-0 justify-center items-center mx-auto flex my-auto h-5 w-5 fill-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" d="M3.37752 5.08241C3 5.62028 3 7.21907 3 10.4167V11.9914C3 17.6294 7.23896 20.3655 9.89856 21.5273C10.62 21.8424 10.9807 22 12 22C13.0193 22 13.38 21.8424 14.1014 21.5273C16.761 20.3655 21 17.6294 21 11.9914V10.4167C21 7.21907 21 5.62028 20.6225 5.08241C20.245 4.54454 18.7417 4.02996 15.7351 3.00079L15.1623 2.80472C13.595 2.26824 12.8114 2 12 2C11.1886 2 10.405 2.26824 8.83772 2.80472L8.26491 3.00079C5.25832 4.02996 3.75503 4.54454 3.37752 5.08241ZM15.0595 10.4995C15.3353 10.1905 15.3085 9.71642 14.9995 9.44055C14.6905 9.16467 14.2164 9.19151 13.9405 9.50049L10.9286 12.8739L10.0595 11.9005C9.78358 11.5915 9.30947 11.5647 9.00049 11.8405C8.69151 12.1164 8.66467 12.5905 8.94055 12.8995L10.3691 14.4995C10.5114 14.6589 10.7149 14.75 10.9286 14.75C11.1422 14.75 11.3457 14.6589 11.488 14.4995L15.0595 10.4995Z"></path></svg>
                ) : (
                  // SVG Bouclier Rouge
                  <svg className="flex-shrink-0 justify-center items-center mx-auto flex my-auto h-5 w-5 fill-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" d="M3.37752 5.08241C3 5.62028 3 7.21907 3 10.4167V11.9914C3 17.6294 7.23896 20.3655 9.89856 21.5273C10.62 21.8424 10.9807 22 12 22C13.0193 22 13.38 21.8424 14.1014 21.5273C16.761 20.3655 21 17.6294 21 11.9914V10.4167C21 7.21907 21 5.62028 20.6225 5.08241C20.245 4.54454 18.7417 4.02996 15.7351 3.00079L15.1623 2.80472C13.595 2.26824 12.8114 2 12 2C11.1886 2 10.405 2.26824 8.83772 2.80472L8.26491 3.00079C5.25832 4.02996 3.75503 4.54454 3.37752 5.08241ZM10.0303 8.96965C9.73744 8.67676 9.26256 8.67676 8.96967 8.96965C8.67678 9.26254 8.67678 9.73742 8.96967 10.0303L10.9394 12L8.96969 13.9697C8.6768 14.2625 8.6768 14.7374 8.96969 15.0303C9.26258 15.3232 9.73746 15.3232 10.0304 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9696L13.0607 12L15.0303 10.0303C15.3232 9.73744 15.3232 9.26256 15.0303 8.96967C14.7374 8.67678 14.2626 8.67678 13.9697 8.96967L12 10.9393L10.0303 8.96965Z"></path></svg>
                )}
                {subscriptionData?.state === 'active' ? 'Protection active' : 'Protection inactive'}
              </li>
            </ul>
          </dd>
        </dl>
        <dl className="flex flex-row gap-1">
          <dt className="md:min-w-40 min-w-20">
            <span className="block md:text-sm text-xs font-medium text-[#a8a8a8]">Expiration:</span>
          </dt>
          <dd>
            <ul className="items-center justify-center flex">
              <li className="my-auto inline-flex justify-center items-center md:text-sm text-xs font-semibold text-white">
                <p>
                  <span className="font-bold">{subscriptionData?.days_remaining}</span> jours restants ({new Date(subscriptionData?.end_date || '').toLocaleDateString()})
                </p>
              </li>
            </ul>
          </dd>
        </dl>
        <dl className="flex flex-row gap-1">
          <dt className="md:min-w-40 min-w-20">
            <span className="block md:text-sm text-xs font-medium text-[#a8a8a8]">Abonnement:</span>
          </dt>
          <dd>
            <ul className="items-center justify-center flex">
              <li className="my-auto inline-flex justify-center items-center md:text-sm text-xs font-semibold text-white">
                <p>{subscriptionData?.name}</p>
              </li>
            </ul>
          </dd>
        </dl>
      </div>
      </div>
    </div>
  );
};

export default StatsCard;

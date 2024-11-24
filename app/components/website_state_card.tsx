import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface WebsiteStateCardProps {
  website: string;
}

const WebsiteStateCard: React.FC<WebsiteStateCardProps> = ({ website }) => {
  const [isBlocked, setIsBlocked] = useState<boolean | null>(null); // null pour l'état de chargement initial
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loader principal
  const [isChanging, setIsChanging] = useState<boolean>(false); // Mini-loader pour les changements

  useEffect(() => {
    // Fonction pour récupérer le statut du site
    const fetchWebsiteStatus = async () => {
      try {
        const response = await fetch('/api/status', {
          cache: 'no-store',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ website }),
        });
  
        if (!response.ok) {
          toast.error("Impossible de récupérer l'état du site. Veuillez réessayer plus tard")
        }
  
        const data = await response.json();
        setIsBlocked(data.blocked);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false); // On cache le loader initial après la première récupération
      }
    };
  
    fetchWebsiteStatus();
  }, [website]);

  // Fonction pour bloquer le site
  const blockWebsite = async () => {
    setIsChanging(true);
    try {
      await fetch('/api/action', {
      cache: 'no-store',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'block', website }),
      });
      toast.success(`Le site ${website} a bien été bloqué`)
      pollStatusChange(true); // Requête répétée jusqu'à confirmation du changement de statut
    } catch (error) {
      toast.error("Une erreur s'est produite lors du blocage du site. Veuillez réessayer plus tard")
      console.error('Erreur lors du blocage du site:', error);
    }
  };

  // Fonction pour débloquer le site
  const unblockWebsite = async () => {
    setIsChanging(true);
    try {
      await fetch('/api/action', {
        cache: 'no-store',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'unblock', website }),
      });
      toast.success(`Le site ${website} a bien été débloqué`)
      pollStatusChange(false); // Requête répétée jusqu'à confirmation du changement de statut
    } catch (error) {
      toast.error("Une erreur s'est produite lors du déblocage du site. Veuillez réessayer plus tard")
      console.error('Erreur lors du déblocage du site:', error);
    }
  };

  // Fonction pour appeler /api/status jusqu'à ce que l'état change
  const pollStatusChange = async (shouldBeBlocked: boolean) => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch('/api/status', {
          cache: 'no-store',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ website }),
        });
        const data = await response.json();

        if (data.blocked === shouldBeBlocked) {
          clearInterval(intervalId); // Arrêter la répétition


          toast.success(`Le serveur vient de confirmer que le site ${website} ${shouldBeBlocked ? 'est bloqué' : 'n’est pas bloqué'}`)
          setIsBlocked(data.blocked); // Met à jour l'état
          setIsChanging(false); // Cache le mini-loader
        }
      } catch (error) {
         toast.error("Impossible de récupérer l'état du site. Veuillez réessayer plus tard")
        console.error('Erreur lors de la vérification du statut:', error);
      }
    }, 10000); // Vérifie toutes les 2 secondes
  };
  
    return (
            <div className="bg-[#171717] p-7 shadow-lg sm:flex-none rounded-2xl w-full">
               <div className="flex w-full justify-between">
                  <h1 className='font-semibold text-white md:text-xl text-sm'>
                     Etat du site
                  </h1>
               </div>
               <div className='relative w-full h-full'>
                  {isLoading && (
                  <div className="z-50 absolute font-semibold text-white h-full justify-center items-center w-full flex gap-4 flex-col bg-[#171717]"><div className="spinner spinner-xl relative mx-auto"></div>Vérification du statut du site</div>
                  )}
                  <div className="pt-8 px-2">
                  <div
                     className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-px after:-translate-y-1/2 after:rounded-lg after:bg-[#a8a8a8]/10"
                     >
                     <ol className="relative z-10 flex justify-between text-sm font-medium text-gray-500">
                        <li className="flex flex-col items-center gap-2 bg-[#171717] relative md:pr-3">
                           <div className="border border-[#a8a8a8]/10 rounded-full md:p-3 p-2 justify-center items-center flex">
                              <svg className="flex-shrink-0 md:w-6 md:h-6 h-4 w-4" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path fillRule="evenodd" clipRule="evenodd" d="M1 20.24C1 19.8203 1.3436 19.48 1.76744 19.48H22.2326C22.6564 19.48 23 19.8203 23 20.24C23 20.6597 22.6564 21 22.2326 21H1.76744C1.3436 21 1 20.6597 1 20.24Z" fill="#fff"/>
                                 <path fillRule="evenodd" clipRule="evenodd" d="M3.68981 3.8904C2.7907 4.78079 2.7907 6.21386 2.7907 9.08V14.1467C2.7907 16.0574 2.7907 17.0128 3.39011 17.6064C3.98952 18.2 4.95425 18.2 6.88372 18.2H17.1163C19.0457 18.2 20.0105 18.2 20.6099 17.6064C21.2093 17.0128 21.2093 16.0574 21.2093 14.1467V9.08C21.2093 6.21386 21.2093 4.78079 20.3102 3.8904C19.4111 3 17.964 3 15.0698 3H8.93023C6.03603 3 4.58893 3 3.68981 3.8904ZM8.16279 15.16C8.16279 14.7403 8.50639 14.4 8.93023 14.4H15.0698C15.4936 14.4 15.8372 14.7403 15.8372 15.16C15.8372 15.5797 15.4936 15.92 15.0698 15.92H8.93023C8.50639 15.92 8.16279 15.5797 8.16279 15.16Z" fill="#fff"/>
                              </svg>
                           </div>
                           <span className="text-white text-center md:text-xs text-[0.6rem]  font-semibold md:w-[6rem] w-[3rem] truncate -bottom-6 absolute">Utilisateurs</span>
                        </li>
                        {isChanging ? (
                        <li className="flex flex-col items-center gap-2 bg-[#171717]">
                           <div className="relative px-3 my-auto justify-center items-center flex">
                              <div className="spinner-min spinner-sm relative flex-shrink-0"></div>
                           </div>
                        </li>
                        ) : isBlocked ? (
                        <li className="flex flex-col items-center gap-2 bg-[#171717]">
                           <div className="relative px-6 my-auto justify-center items-center flex">
                              <svg className="absolute flex-shrink-0 inset-0 justify-center items-center mx-auto flex my-auto md:w-8 md:h-8 h-6 w-6"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path fillRule="evenodd" clipRule="evenodd" d="M3.37752 5.08241C3 5.62028 3 7.21907 3 10.4167V11.9914C3 17.6294 7.23896 20.3655 9.89856 21.5273C10.62 21.8424 10.9807 22 12 22C13.0193 22 13.38 21.8424 14.1014 21.5273C16.761 20.3655 21 17.6294 21 11.9914V10.4167C21 7.21907 21 5.62028 20.6225 5.08241C20.245 4.54454 18.7417 4.02996 15.7351 3.00079L15.1623 2.80472C13.595 2.26824 12.8114 2 12 2C11.1886 2 10.405 2.26824 8.83772 2.80472L8.26491 3.00079C5.25832 4.02996 3.75503 4.54454 3.37752 5.08241ZM10.0303 8.96965C9.73744 8.67676 9.26256 8.67676 8.96967 8.96965C8.67678 9.26254 8.67678 9.73742 8.96967 10.0303L10.9394 12L8.96969 13.9697C8.6768 14.2625 8.6768 14.7374 8.96969 15.0303C9.26258 15.3232 9.73746 15.3232 10.0304 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9696L13.0607 12L15.0303 10.0303C15.3232 9.73744 15.3232 9.26256 15.0303 8.96967C14.7374 8.67678 14.2626 8.67678 13.9697 8.96967L12 10.9393L10.0303 8.96965Z" fill="#ef4444"/>
                              </svg>
                              <div className="absolute h-12 w-12 bg-red-500/20 animate-ping rounded-full p-2 flex justify-center items-center">
                                 <div className="h-8 w-8 bg-red-500/50 rounded-full"></div>
                              </div>
                           </div>
                        </li>
                        ) : (
                        <li className="flex flex-col items-center gap-2 bg-[#171717]">
                           <div className="relative px-6 my-auto justify-center items-center flex">
                              <svg className="absolute flex-shrink-0 inset-0 justify-center items-center mx-auto flex my-auto md:w-8 md:h-8 h-6 w-6"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" d="M3.37752 5.08241C3 5.62028 3 7.21907 3 10.4167V11.9914C3 17.6294 7.23896 20.3655 9.89856 21.5273C10.62 21.8424 10.9807 22 12 22C13.0193 22 13.38 21.8424 14.1014 21.5273C16.761 20.3655 21 17.6294 21 11.9914V10.4167C21 7.21907 21 5.62028 20.6225 5.08241C20.245 4.54454 18.7417 4.02996 15.7351 3.00079L15.1623 2.80472C13.595 2.26824 12.8114 2 12 2C11.1886 2 10.405 2.26824 8.83772 2.80472L8.26491 3.00079C5.25832 4.02996 3.75503 4.54454 3.37752 5.08241ZM15.0595 10.4995C15.3353 10.1905 15.3085 9.71642 14.9995 9.44055C14.6905 9.16467 14.2164 9.19151 13.9405 9.50049L10.9286 12.8739L10.0595 11.9005C9.78358 11.5915 9.30947 11.5647 9.00049 11.8405C8.69151 12.1164 8.66467 12.5905 8.94055 12.8995L10.3691 14.4995C10.5114 14.6589 10.7149 14.75 10.9286 14.75C11.1422 14.75 11.3457 14.6589 11.488 14.4995L15.0595 10.4995Z" fill="#22c55e"/>
                              </svg>
                           </div>
                        </li>
                        )}
                        <li className="flex flex-col items-center gap-2 bg-[#171717] relative md:px-3">
                           <div className="border border-[#a8a8a8]/10 rounded-full md:p-3 p-2 justify-center items-center flex">
                              <svg className="flex-shrink-0 md:w-6 md:h-6 h-4 w-4" width="44" height="33" viewBox="0 0 44 33" fill="none">
                                 <path d="M1.43568 15.5C0.569739 15.5 -0.122974 14.7664 0.0184833 13.9121C1.27789 6.30615 7.95207 0.5 16.1713 0.5H19.5514C20.2615 0.5 20.8371 1.07563 20.8371 1.78571C20.8371 9.35991 14.697 15.5 7.1228 15.5H1.43568Z" fill="#fff"></path>
                                 <path d="M1.43561 17.5C0.569673 17.5 -0.123043 18.2336 0.018416 19.0879C1.27783 26.6938 7.95207 32.5 16.1713 32.5H19.5514C20.2615 32.5 20.8371 31.9244 20.8371 31.2143C20.8371 23.6401 14.697 17.5 7.1228 17.5H1.43561Z" fill="#fff"></path>
                                 <path d="M36.5513 17.5C28.9771 17.5 22.837 23.6401 22.837 31.2143C22.837 31.9244 23.4127 32.5 24.1227 32.5H27.5028C35.722 32.5 42.3962 26.6938 43.6556 19.0879C43.7971 18.2336 43.1044 17.5 42.2384 17.5H36.5513Z" fill="#fff"></path>
                                 <path d="M42.2384 15.5C43.1044 15.5 43.7971 14.7664 43.6556 13.9121C42.3962 6.30615 35.722 0.5 27.5028 0.5H24.1227C23.4127 0.5 22.837 1.07563 22.837 1.78571C22.837 9.35991 28.9771 15.5 36.5513 15.5H42.2384Z" fill="#fff"></path>
                              </svg>
                           </div>
                           <span className="-bottom-6 absolute text-white text-center  md:text-xs text-[0.6rem] font-semibold md:w-[6rem] w-[3rem] truncate">ControlD</span>
                        </li>
                        <li className="flex flex-col items-center gap-2 bg-[#171717] relative md:pl-3">
                           <div className="border border-[#a8a8a8]/10 rounded-full md:p-3 p-2 justify-center items-center flex">
                              <svg className="flex-shrink-0 md:w-6 md:h-6 h-4 w-4" width="20" height="20" viewBox="0 0 512 512" enableBackground="new 0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                 <path d="m437.02 74.98c-48.353-48.352-112.64-74.98-181.02-74.98s-132.667 26.628-181.02 74.98-74.98 112.64-74.98 181.02 26.628 132.667 74.98 181.02 112.64 74.98 181.02 74.98 132.667-26.628 181.02-74.98 74.98-112.64 74.98-181.02-26.628-132.667-74.98-181.02zm-2.132 315.679c-15.31-10.361-31.336-19.314-47.952-26.789 7.339-28.617 11.697-59.688 12.784-91.87h79.702c-3.144 44.336-19.244 85.147-44.534 118.659zm-402.31-118.659h79.702c1.088 32.183 5.446 63.254 12.784 91.87-16.616 7.475-32.642 16.427-47.952 26.789-25.29-33.512-41.39-74.323-44.534-118.659zm44.53-150.654c15.31 10.362 31.336 19.315 47.954 26.79-7.338 28.615-11.695 59.683-12.783 91.864h-79.701c3.144-44.334 19.243-85.142 44.53-118.654zm283.519-42.581c-5.863-10.992-12.198-20.911-18.935-29.713 27.069 11.25 51.473 27.658 71.977 47.997-11.625 7.638-23.702 14.369-36.155 20.185-4.886-13.664-10.528-26.547-16.887-38.469zm-12.965 50.404c-29.211 9.792-60.039 14.831-91.662 14.831s-62.451-5.039-91.662-14.831c20.463-58.253 54.273-97.169 91.662-97.169s71.199 38.916 91.662 97.169zm-203.359 110.831c1.056-28.342 4.885-55.421 10.937-80.116 32.136 10.644 66.018 16.116 100.76 16.116s68.624-5.472 100.76-16.116c6.053 24.695 9.881 51.773 10.937 80.116zm223.394 32c-1.057 28.344-4.885 55.424-10.938 80.12-32.139-10.646-66.02-16.12-100.759-16.12s-68.62 5.474-100.759 16.12c-6.053-24.696-9.882-51.776-10.938-80.12zm-216.324-193.235c-6.358 11.922-12 24.805-16.887 38.468-12.452-5.815-24.53-12.547-36.155-20.185 20.503-20.34 44.907-36.747 71.977-47.997-6.737 8.803-13.073 18.722-18.935 29.714zm-16.886 316.008c4.886 13.661 10.528 26.542 16.885 38.462 5.863 10.992 12.198 20.911 18.935 29.713-27.067-11.25-51.469-27.655-71.971-47.992 11.625-7.637 23.701-14.368 36.151-20.183zm29.853-11.938c29.213-9.794 60.04-14.835 91.66-14.835s62.447 5.041 91.66 14.835c-20.463 58.251-54.272 97.165-91.66 97.165s-71.197-38.914-91.66-97.165zm196.287 50.4c6.357-11.92 11.999-24.801 16.885-38.462 12.451 5.815 24.527 12.547 36.151 20.183-20.502 20.337-44.904 36.743-71.971 47.992 6.737-8.802 13.073-18.721 18.935-29.713zm39.093-193.235c-1.088-32.18-5.445-63.249-12.783-91.864 16.618-7.475 32.645-16.428 47.954-26.79 25.287 33.511 41.386 74.319 44.53 118.654z" fill="#fff"></path>
                              </svg>
                           </div>
                           <span className="-bottom-6 absolute text-white text-center md:text-xs text-[0.6rem] font-semibold md:w-[6rem] w-[3rem] truncate">{website}</span>
                        </li>
                     </ol>
                  </div>
                  {!isChanging && (
                  <p className="text-center mx-auto md:text-sm text-xs text-white font-semibold mt-12">Le site {website} {isBlocked ? 'est bloqué' : 'n’est pas bloqué'}</p>
                  )}
                  <div className="flex justify-center items-center mb-1 mt-6">
                  {isChanging ? (

                           <div className="px-4 py-3 w-full rounded-xl bg-green-500 mt-8 text-white leading-relaxe font-semibold text-xs items-center flex">
                              <svg className="mr-2 flex-shrink-0 w-4 h-4 inline align-middle" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z" fill="#fff"/>
                              </svg>
                              L&apos;action à bien été effectuée, vous pouvez  retourner sur &quot;{website}&quot
                          
                        </div>
                  ) : (
                     isBlocked ? (
                     <button onClick={unblockWebsite} className="flex items-center justify-center text-center md:px-4 px-2 md:py-3 py-1.5 md:text-sm text-xs md:rounded-xl rounded-lg text-green-500 bg-green-900/50 hover:bg-green-500 focus:bg-green-500 hover:text-white focus:text-white truncate font-semibold gap-2 group transition duration-200">
                        <svg className="my-auto flex-shrink-0 md:h-5 md:w-5 h-3 w-3 fill-green-500 group-focus:fill-white group-hover:fill-white transition duration-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" d="M12 2.75C9.10051 2.75 6.75 5.10051 6.75 8V10.0036C7.13301 10 7.54849 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.40931 10.348 4.13525 10.1379 5.25 10.0546V8C5.25 4.27208 8.27208 1.25 12 1.25C15.1463 1.25 17.788 3.4019 18.5373 6.31306C18.6405 6.7142 18.3991 7.12308 17.9979 7.22633C17.5968 7.32957 17.1879 7.08808 17.0846 6.68694C16.5018 4.42242 14.4453 2.75 12 2.75ZM12.75 14C12.75 13.5858 12.4142 13.25 12 13.25C11.5858 13.25 11.25 13.5858 11.25 14V18C11.25 18.4142 11.5858 18.75 12 18.75C12.4142 18.75 12.75 18.4142 12.75 18V14Z" fill="##22c55e"/>
                        </svg>
                        Débloqué ce site
                     </button>
                     ) : (
                     <button onClick={blockWebsite} className="flex items-center justify-center text-center md:px-4 px-2 md:py-3 py-1.5 md:text-sm text-xs md:rounded-xl rounded-lg text-red-500 bg-red-900/50 hover:bg-red-500 focus:bg-red-500 hover:text-white focus:text-white truncate font-semibold gap-2 group transition duration-200">
                        <svg className="my-auto flex-shrink-0 md:h-5 md:w-5 h-3 w-3 fill-red-500 group-focus:fill-white group-hover:fill-white transition duration-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path fillRule="evenodd" clipRule="evenodd" d="M5.25 10.0546V8C5.25 4.27208 8.27208 1.25 12 1.25C15.7279 1.25 18.75 4.27208 18.75 8V10.0546C19.8648 10.1379 20.5907 10.348 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.40931 10.348 4.13525 10.1379 5.25 10.0546ZM6.75 8C6.75 5.10051 9.10051 2.75 12 2.75C14.8995 2.75 17.25 5.10051 17.25 8V10.0036C16.867 10 16.4515 10 16 10H8C7.54849 10 7.13301 10 6.75 10.0036V8Z" />
                        </svg>
                        Bloqué ce site
                     </button>
                     )

                  )}
                  </div>
                  </div>
               </div>
            </div>
    );
};

export default WebsiteStateCard;
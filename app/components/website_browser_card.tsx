import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const WebsiteBrowserCard: React.FC = () => {
    const [url, setUrl] = useState('');

    // Fonction de validation pour vérifier l'URL
    const validateUrl = (value: string) => {
        const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+)(\/[^\s]*)?$/;
        return urlRegex.test(value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateUrl(url)) {
            toast.error("URL invalide. Veuillez saisir une URL valide.");
            return;
        }

        // Retirer 'https://' ou 'http://' de l'URL pour l'envoyer proprement au serveur
        const sanitizedUrl = url.replace(/^(https?:\/\/)/, '');

        // Créer un nouveau lien avec l'URL nettoyée et rediriger
        const formAction = `/action?w=${encodeURIComponent(sanitizedUrl)}`;
        window.location.href = formAction;
    };

    return (
        <div className="bg-[#171717] p-7 shadow-lg sm:flex-none rounded-2xl w-full">
        <div className="text-center">
        <h3 className="text-sm font-semibold text-white mb-4 leading-loose">
            Avec Locked, bloquez ou débloquez facilement les sites malveillants et les publicités sur votre 
            <svg className="mx-2 flex-shrink-0 w-6 h-6 inline align-middle" width="44" height="33" viewBox="0 0 44 33" fill="none">
                <path d="M1.43568 15.5C0.569739 15.5 -0.122974 14.7664 0.0184833 13.9121C1.27789 6.30615 7.95207 0.5 16.1713 0.5H19.5514C20.2615 0.5 20.8371 1.07563 20.8371 1.78571C20.8371 9.35991 14.697 15.5 7.1228 15.5H1.43568Z" fill="#fff"></path>
                <path d="M1.43561 17.5C0.569673 17.5 -0.123043 18.2336 0.018416 19.0879C1.27783 26.6938 7.95207 32.5 16.1713 32.5H19.5514C20.2615 32.5 20.8371 31.9244 20.8371 31.2143C20.8371 23.6401 14.697 17.5 7.1228 17.5H1.43561Z" fill="#fff"></path>
                <path d="M36.5513 17.5C28.9771 17.5 22.837 23.6401 22.837 31.2143C22.837 31.9244 23.4127 32.5 24.1227 32.5H27.5028C35.722 32.5 42.3962 26.6938 43.6556 19.0879C43.7971 18.2336 43.1044 17.5 42.2384 17.5H36.5513Z" fill="#fff"></path>
                <path d="M42.2384 15.5C43.1044 15.5 43.7971 14.7664 43.6556 13.9121C42.3962 6.30615 35.722 0.5 27.5028 0.5H24.1227C23.4127 0.5 22.837 1.07563 22.837 1.78571C22.837 9.35991 28.9771 15.5 36.5513 15.5H42.2384Z" fill="#fff"></path>
            </svg>
            Control D
        </h3>
        <p className="text-xs text-[#a8a8a8] font-semibold">
            Pour bloquer ou débloquer un site, commencez par saisir une URL ci-dessous.
        </p>
        </div>
        
        <form onSubmit={handleSubmit} method="get" action="/action" className="group mt-8 relative flex items-center gap-1 w-full rounded-xl border border-[#a8a8a8]/10">
        
        <input value={url} onChange={(e) => setUrl(e.target.value)} id="url" name="w" type="text" placeholder="www.exemple.com" className="text-sm outline-none flex-1 mr-8 p-4 bg-[#171717] rounded-xl placeholder-[#a8a8a8] transition duration-200 text-white font-medium"/>
        <button type="submit" className="hidden">Aller</button>

        <svg className="absolute right-4 pointer-events-none fill-[#a8a8a8]" width="20" height="20" viewBox="0 0 512 512" enableBackground="new 0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <path d="m437.02 74.98c-48.353-48.352-112.64-74.98-181.02-74.98s-132.667 26.628-181.02 74.98-74.98 112.64-74.98 181.02 26.628 132.667 74.98 181.02 112.64 74.98 181.02 74.98 132.667-26.628 181.02-74.98 74.98-112.64 74.98-181.02-26.628-132.667-74.98-181.02zm-2.132 315.679c-15.31-10.361-31.336-19.314-47.952-26.789 7.339-28.617 11.697-59.688 12.784-91.87h79.702c-3.144 44.336-19.244 85.147-44.534 118.659zm-402.31-118.659h79.702c1.088 32.183 5.446 63.254 12.784 91.87-16.616 7.475-32.642 16.427-47.952 26.789-25.29-33.512-41.39-74.323-44.534-118.659zm44.53-150.654c15.31 10.362 31.336 19.315 47.954 26.79-7.338 28.615-11.695 59.683-12.783 91.864h-79.701c3.144-44.334 19.243-85.142 44.53-118.654zm283.519-42.581c-5.863-10.992-12.198-20.911-18.935-29.713 27.069 11.25 51.473 27.658 71.977 47.997-11.625 7.638-23.702 14.369-36.155 20.185-4.886-13.664-10.528-26.547-16.887-38.469zm-12.965 50.404c-29.211 9.792-60.039 14.831-91.662 14.831s-62.451-5.039-91.662-14.831c20.463-58.253 54.273-97.169 91.662-97.169s71.199 38.916 91.662 97.169zm-203.359 110.831c1.056-28.342 4.885-55.421 10.937-80.116 32.136 10.644 66.018 16.116 100.76 16.116s68.624-5.472 100.76-16.116c6.053 24.695 9.881 51.773 10.937 80.116zm223.394 32c-1.057 28.344-4.885 55.424-10.938 80.12-32.139-10.646-66.02-16.12-100.759-16.12s-68.62 5.474-100.759 16.12c-6.053-24.696-9.882-51.776-10.938-80.12zm-216.324-193.235c-6.358 11.922-12 24.805-16.887 38.468-12.452-5.815-24.53-12.547-36.155-20.185 20.503-20.34 44.907-36.747 71.977-47.997-6.737 8.803-13.073 18.722-18.935 29.714zm-16.886 316.008c4.886 13.661 10.528 26.542 16.885 38.462 5.863 10.992 12.198 20.911 18.935 29.713-27.067-11.25-51.469-27.655-71.971-47.992 11.625-7.637 23.701-14.368 36.151-20.183zm29.853-11.938c29.213-9.794 60.04-14.835 91.66-14.835s62.447 5.041 91.66 14.835c-20.463 58.251-54.272 97.165-91.66 97.165s-71.197-38.914-91.66-97.165zm196.287 50.4c6.357-11.92 11.999-24.801 16.885-38.462 12.451 5.815 24.527 12.547 36.151 20.183-20.502 20.337-44.904 36.743-71.971 47.992 6.737-8.802 13.073-18.721 18.935-29.713zm39.093-193.235c-1.088-32.18-5.445-63.249-12.783-91.864 16.618-7.475 32.645-16.428 47.954-26.79 25.287 33.511 41.386 74.319 44.53 118.654z"/>
        </svg>
        </form>
        </div>
    );
};

export default WebsiteBrowserCard;
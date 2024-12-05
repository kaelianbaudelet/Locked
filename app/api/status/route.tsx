import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { website } = await request.json();

    // Vérifie si le paramètre 'website' est présent
    if (!website) {
        return NextResponse.json({ error: "BadRequestError", message: "Argument 'website' is missing" }, { status: 400 });
    }

    // Ajouter automatiquement 'https://' si le schéma n'est pas fourni
    const formattedWebsite = website.startsWith("http://") || website.startsWith("https://") ? website : `https://${website}`;

    try {
        // Utiliser un module de Node.js pour faire une requête HTTP
        const response = await fetch(formattedWebsite, { cache: "no-store" });

        const html = await response.text();

        // Vérifie si le script indiquant que le site est bloqué est présent dans le HTML
        const isBlocked = html.includes("verify.controld.com/detect/fetch-cbp");

        return NextResponse.json({ blocked: isBlocked });
    } catch (error) {
        console.error("Error fetching the website:", error);
        return NextResponse.json({ error: "InternalServerError", message: "Unable to fetch the website" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";

type MockResult = {
    vendor: string;
    result: string | null; // Allow null
};

export async function POST(request: Request) {
    const { website } = await request.json();

    // Vérifie si le paramètre 'website' est présent
    if (!website) {
        return NextResponse.json({ error: "BadRequestError", message: "Argument 'website' is missing" }, { status: 400 });
    }

    if (!process.env.VIRUSTOTAL_API_KEY) {
        return NextResponse.json({ error: "NoWebsafetyKeyProvided", message: "Please set a websatefy key to use this" }, { status: 503 });
    }

    // Préparation des données pour l'envoi
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("url", website);

    // Première requête pour envoyer l'URL
    const response = await fetch("https://www.virustotal.com/api/v3/urls", {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/x-www-form-urlencoded",
            "x-apikey": String(process.env.VIRUSTOTAL_API_KEY),
        },
        body: urlSearchParams.toString(), // Convertir en chaîne de caractères
    });

    // Vérifie la réponse
    if (!response.ok) {
        return NextResponse.json({ error: "BadRequestError", message: "Invalid response from VirusTotal" }, { status: response.status });
    }

    const data = await response.json();

    // Vérifie si la réponse contient le lien pour l'analyse
    if (!data.data || !data.data.links || !data.data.links.self) {
        return NextResponse.json({ error: "BadRequestError", message: "Invalid response structure" }, { status: 400 });
    }

    const analysisUrl = data.data.links.self;
    let attempts = 0;
    let status = "queued"; // Initialiser avec une valeur par défaut
    let analysisData; // Déclare analysisData ici

    while (attempts < 5 && status !== "completed") {
        // Effectuer une requête pour vérifier le statut de l'analyse
        const statusResponse = await fetch(analysisUrl, {
            headers: {
                accept: "application/json",
                "x-apikey": String(process.env.VIRUSTOTAL_API_KEY),
            },
        });

        analysisData = await statusResponse.json();

        status = analysisData.data.attributes.status;

        if (status !== "completed") {
            await new Promise((res) => setTimeout(res, 15000)); // Attendre 15 secondes
            attempts++;
        }
    }

    // Si après 5 tentatives l'analyse n'est toujours pas terminée, renvoie une erreur
    if (status !== "completed") {
        return NextResponse.json({ error: "ServerError", message: "Analysis did not complete in time" }, { status: 500 });
    }

    // Transformation des résultats
    const results: MockResult[] = [];
    const attributes = analysisData.data.attributes;

    if (attributes && attributes.results) {
        for (const [vendor, resultInfo] of Object.entries(attributes.results)) {
            // Assert that resultInfo is an object with a "result" field of type string | null
            const { result } = resultInfo as { result: string | null }; // Type assertion here

            // Conversion des résultats
            let finalResult;
            if (result === "clean" || result === "harmless") {
                finalResult = "safe";
            } else if (result === "unrated") {
                finalResult = null;
            } else {
                finalResult = "unsafe";
            }

            results.push({ vendor, result: finalResult });
        }
    }

    return NextResponse.json(results);
}

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Récupérer les données du body (ex : { type: 'block', website: 'test.com' })
    const { type, website } = await request.json();

    // Valider que les paramètres nécessaires sont présents
    if (!type || !website) {
      return NextResponse.json(
        { error: 'Missing parameters: type or website' },
        { status: 400 }
      );
    }

    // En-têtes communs pour toutes les requêtes
    const headers = {
      accept: 'application/json',
      authorization: `Bearer ${process.env.CONTROLD_API_KEY}`,
      'content-type': 'application/x-www-form-urlencoded',
    };

    const apiUrl = 'https://api.controld.com/profiles/604857cdgaac/rules';

    // 1. Supprimer toute règle existante pour le site
    try {
      const deleteResponse = await fetch(apiUrl, {
        cache: 'no-store',
        method: 'DELETE',
        headers,
        body: new URLSearchParams({
          'hostnames[]': website,
        }),
      });

      if (!deleteResponse.ok) {
        console.warn(`Failed to delete rule for ${website}. Continuing...`);
      }
    } catch (error) {
      console.warn(`Error trying to delete rule for ${website}:`, error);
    }

    // 2. Ajouter une nouvelle règle en fonction de l'action (block ou unblock)
    let fetchOptions: RequestInit;

    if (type === 'block') {
      // Requête pour bloquer le site (do=0, status=1)
      fetchOptions = {
        cache: 'no-store',
        method: 'POST',
        headers,
        body: new URLSearchParams({
          do: '0',
          status: '1',
          'hostnames[]': website,
        }),
      };
    } else if (type === 'unblock') {
      // Requête pour débloquer le site (do=1, status=1)
      fetchOptions = {
        cache: 'no-store',
        method: 'POST',
        headers,
        body: new URLSearchParams({
          do: '1',
          status: '1',
          'hostnames[]': website,
        }),
      };
    } else {
      return NextResponse.json(
        { error: 'Invalid type: must be "block" or "unblock"' },
        { status: 400 }
      );
    }

    // Effectuer la requête pour ajouter la règle
    const response = await fetch(apiUrl, fetchOptions);
    const data = await response.json();

    // Vérifier la réponse de l'API Controld
    if (!response.ok) {
      return NextResponse.json({ error: data.error }, { status: response.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in /api/action:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

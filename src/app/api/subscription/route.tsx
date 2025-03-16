import { NextResponse } from 'next/server';

export async function POST() {
    // En-têtes communs pour toutes les requêtes
    const headers = {
        accept: 'application/json',
        authorization: `Bearer ${process.env.CONTROLD_API_KEY}`,
        'content-type': 'application/x-www-form-urlencoded',
    };

    const apiUrl = 'https://api.controld.com/billing/subscriptions';

    try {
        // Appel à l'API externe
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch subscription data' }, { status: 500 });
        }

        const data = await response.json();

        // Extraction des données importantes
        const subscription = data.body.subscriptions[0]; // On suppose qu'il y a une seule souscription
        const { state, next_rebill_date, started, product: { name } } = subscription;


        // Calcul du nombre de jours restants avant la date de fin
        const endDate = new Date(next_rebill_date);
        const currentDate = new Date();
        const daysRemaining = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

        // Renvoi de la réponse
        return NextResponse.json({
            state,
            started,
            end_date: next_rebill_date,
            days_remaining: daysRemaining,
            name
        });
    } catch (error) {
        console.error('Error fetching subscription data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

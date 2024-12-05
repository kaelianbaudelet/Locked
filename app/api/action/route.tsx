import { NextResponse } from "next/server";

interface Folder {
    name: string;
    do: 0 | 1 | 2 | 3;
    status: number;
    pk?: number;
}

export async function POST(request: Request) {
    try {
        // Récupérer les données du body (ex : { type: 'block', website: 'test.com' })
        const { type, website } = await request.json();

        // Valider que les paramètres nécessaires sont présents
        if (!type || !website) {
            return NextResponse.json({ error: "Missing parameters: type or website" }, { status: 400 });
        }

        // En-têtes communs pour toutes les requêtes
        const headers = {
            accept: "application/json",
            authorization: `Bearer ${process.env.CONTROLD_API_KEY}`,
            "content-type": "application/x-www-form-urlencoded",
        };

        const apiUrl = `https://api.controld.com/profiles/${process.env.CONTROLD_PROFILE_ID}`;

        const folders: Folder[] = [
            {
                name: "Locked_blocked",
                do: 0,
                status: 1,
            },
            {
                name: "Locked_bypass",
                do: 1,
                status: 1,
            },
        ];

        try {
            const response = await fetch(apiUrl + "/groups", {
                cache: "no-store",
                method: "GET",
                headers,
            });

            if (!response.ok) {
                console.warn(`Failed to get groups for ${website}. Continuing...`);
            }

            const data = await response.json();

            if (!data) {
                for (const folder of folders) {
                    try {
                        const response = await fetch(apiUrl + "/groups", {
                            cache: "no-store",
                            method: "POST",
                            headers,
                            body: new URLSearchParams({
                                do: folder.do.toString(),
                                status: folder.status.toString(),
                                name: folder.name,
                            }),
                        });

                        const data = await response.json();

                        if (data.error && data.error.code === 40003) {
                            console.warn(`Failed to create group for ${website} because this folder name already exists. Skipping...`);
                        }

                        return NextResponse.json({ success: true, data });
                    } catch (error) {
                        console.warn(`Error trying to get group for ${website}:`, error);
                    }
                }
            } else {
                for (const folder of folders) {
                    for (const group of data.body.groups) {
                        if (group.group !== folder.name) {
                            try {
                                const response = await fetch(apiUrl + "/groups", {
                                    cache: "no-store",
                                    method: "POST",
                                    headers,
                                    body: new URLSearchParams({
                                        do: folder.do.toString(),
                                        status: folder.status.toString(),
                                        name: folder.name,
                                    }),
                                });

                                const data = await response.json();

                                if (data.error && data.error.code === 40003) {
                                    console.warn(`Failed to create group for ${website} because this folder name already exists. Skipping...`);
                                }
                                break;
                            } catch (error) {
                                console.warn(`Error trying to create group for ${website}:`, error);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.warn(`Error trying to get groups for ${website}:`, error);
        }

        try {
            const response = await fetch(apiUrl + "/groups", {
                cache: "no-store",
                method: "GET",
                headers,
            });

            if (!response.ok) {
                console.warn(`Failed to get groups for ${website}. Continuing...`);
            }

            const foldersData = await response.json();

            let pkBlock;
            let pkUnblock;

            for (const folderData of foldersData.body.groups) {
                console.log(folderData);

                for (const folder of folders) {
                    if (folderData.group === folder.name && folderData.action.do === folder.do) {
                        if (folder.do == 0) {
                            pkBlock = folderData.PK;
                        } else {
                            pkUnblock = folderData.PK;
                        }
                    }
                }
            }

            try {
                // 2. Ajouter une nouvelle règle en fonction de l'action (block ou unblock)
                let fetchOptions: RequestInit;

                console.log("pkBlock", pkBlock);
                console.log("pkUnblock", pkUnblock);

                try {
                    const deleteResponse = await fetch(apiUrl + "/rules", {
                        cache: "no-store",
                        method: "DELETE",
                        headers,
                        body: new URLSearchParams({
                            "hostnames[]": website,
                            group: type === "block" ? pkBlock.toString() : pkUnblock.toString(),
                        }),
                    });

                    if (!deleteResponse.ok) {
                        console.warn(`Failed to delete rule for ${website}. Continuing...`);
                    }
                } catch (error) {
                    console.warn(`Error trying to delete rule for ${website}:`, error);
                }

                if (type === "block") {
                    fetchOptions = {
                        cache: "no-store",
                        method: "POST",
                        headers,
                        body: new URLSearchParams({
                            do: "0",
                            status: "1",
                            "hostnames[]": website,
                            group: pkBlock.toString(),
                        }),
                    };
                } else if (type === "unblock") {
                    fetchOptions = {
                        cache: "no-store",
                        method: "POST",
                        headers,
                        body: new URLSearchParams({
                            do: "1",
                            status: "1",
                            "hostnames[]": website,
                            group: pkUnblock.toString(),
                        }),
                    };
                } else {
                    return NextResponse.json({ error: 'Invalid type: must be "block" or "unblock"' }, { status: 400 });
                }

                // Effectuer la requête pour ajouter la règle
                const response = await fetch(apiUrl + "/rules", fetchOptions);
                const data = await response.json();

                console.log("dddd", data);

                // Vérifier la réponse de l'API Controld
                if (!response.ok) {
                    return NextResponse.json({ error: data.error }, { status: response.status });
                }

                return NextResponse.json({ success: true, data });
            } catch (error) {
                console.warn(`Error trying to get groups for ${website}:`, error);
            }
        } catch (error) {
            console.warn(`Error trying to get groups for ${website}:`, error);
        }
    } catch (error) {
        console.error("Error in /api/action:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

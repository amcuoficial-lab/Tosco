// Vercel Serverless Function: api/get-emails.js
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido.' });
    }

    try {
        // Authenticate admin (Basic Auth: tosco / admin123)
        const authHeader = req.headers.authorization;
        if (!authHeader || authHeader !== 'Basic dG9zY286YWRtaW4xMjM=') {
            return res.status(401).json({ error: 'No autorizado.' });
        }

        const bucketId = 'bucket_tosco_almacen_335196ff';

        // Fetch all keys starting with tosco:email:
        const response = await fetch(`https://kvdb.io/${bucketId}/?prefix=tosco:email:`);
        if (!response.ok) {
            throw new Error('No se pudo leer la base de datos de correos.');
        }

        const keysText = await response.text();
        
        // KVdb.io returns keys separated by newline
        const keys = keysText.split('\n').filter(k => k.trim() !== '');
        
        // Map keys to get clean email addresses and fetch registration dates
        const emailsList = [];
        
        for (const key of keys) {
            const emailAddr = key.replace('tosco:email:', '');
            // Get value (date)
            const valRes = await fetch(`https://kvdb.io/${bucketId}/${key}`);
            const dateStr = valRes.ok ? await valRes.text() : new Date().toISOString();
            
            emailsList.push({
                email: emailAddr,
                registeredAt: dateStr
            });
        }

        return res.status(200).json({
            success: true,
            emails: emailsList
        });

    } catch (error) {
        console.error('Error in api/get-emails:', error);
        return res.status(500).json({ error: 'Error al recuperar los correos registrados.', details: error.message });
    }
};

// Vercel Serverless Function: api/cotizar.js
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido. Use POST.' });
    }

    try {
        const { zip } = req.body || {};
        if (!zip) {
            return res.status(400).json({ error: 'Código postal de destino (zip) es requerido.' });
        }

        const apiKey = process.env.ENVIOPACK_API_KEY;

        // If no API Key is provided, use mock data (Sandbox/Demo mode)
        if (!apiKey) {
            // Simulated prices based on distance from Olavarría (CP 7400)
            const zipInt = parseInt(zip) || 1000;
            const diff = Math.abs(zipInt - 7400);
            
            // Calculate a semi-random but consistent shipping cost based on postal code
            const baseCostAndreani = 3200 + (diff % 15) * 200;
            const baseCostCorreo = 2800 + (diff % 12) * 180;

            const options = [
                {
                    carrier: 'Andreani',
                    service: 'Estandar',
                    cost: baseCostAndreani,
                    delivery_days: 3 + (diff % 3),
                    description: 'Envío standard a domicilio'
                },
                {
                    carrier: 'Correo Argentino',
                    service: 'Clasico',
                    cost: baseCostCorreo,
                    delivery_days: 4 + (diff % 4),
                    description: 'Envío clásico a domicilio'
                }
            ];

            return res.status(200).json({
                mode: 'sandbox_simulation',
                origin: 'Olavarría (7400)',
                destination: zip,
                options: options
            });
        }

        // Real API call to Envíopack
        // Docs reference: POST https://api.enviopack.com/cotizar
        const response = await fetch('https://api.enviopack.com/cotizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                codigo_postal_origen: '7400', // Olavarría
                codigo_postal_destino: zip,
                peso: 1.5, // Standard parcel weight
                paquetes: [{ alto: 10, ancho: 20, largo: 30, peso: 1.5 }]
            })
        });

        if (!response.ok) {
            const errData = await response.text();
            throw new Error(`Envíopack API Error: ${errData}`);
        }

        const data = await response.json();
        
        // Map EnvíoPack response to a clean layout
        // Envíopack returns an array of services with cost, carrier, transit time
        const options = (data || []).map(service => ({
            carrier: service.correo || 'Transporte',
            service: service.servicio || 'Estándar',
            cost: Math.round(service.costo),
            delivery_days: service.horas_entrega ? Math.ceil(service.horas_entrega / 24) : 4,
            description: service.modalidad === 'D' ? 'A Domicilio' : 'A Sucursal'
        }));

        return res.status(200).json({
            mode: 'official_api',
            origin: 'Olavarría (7400)',
            destination: zip,
            options: options
        });

    } catch (error) {
        console.error('Error in api/cotizar:', error);
        return res.status(500).json({ error: 'Fallo al cotizar el envío.', details: error.message });
    }
};

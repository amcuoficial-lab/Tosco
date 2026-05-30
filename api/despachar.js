// Vercel Serverless Function: api/despachar.js
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
        const { orderId, customer, carrier } = req.body || {};
        if (!orderId || !customer || !carrier) {
            return res.status(400).json({ error: 'Faltan campos requeridos (orderId, customer, carrier).' });
        }

        const apiKey = process.env.ENVIOPACK_API_KEY;

        // Sandbox/Simulation Mode
        if (!apiKey) {
            const prefix = carrier.substring(0, 3).toUpperCase();
            const trackingId = `${prefix}-${String(orderId).padStart(6, '0')}-AR`;
            
            // Return a public PDF or document simulation
            return res.status(200).json({
                mode: 'sandbox_simulation',
                success: true,
                tracking_id: trackingId,
                label_pdf_url: `print-label.html?orderId=${orderId}`
            });
        }

        // Real API call to Envíopack
        // Docs reference: POST https://api.enviopack.com/envios
        const response = await fetch('https://api.enviopack.com/envios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                codigo_postal_origen: '7400', // Olavarría
                correo: carrier,
                destinatario: {
                    nombre: customer.name,
                    email: customer.email,
                    telefono: customer.phone,
                    direccion: customer.address,
                    localidad: customer.city,
                    provincia: customer.state,
                    codigo_postal: customer.zip
                },
                referencia: `Pedido Tosco #${orderId}`,
                paquetes: [{ alto: 10, ancho: 20, largo: 30, peso: 1.5 }]
            })
        });

        if (!response.ok) {
            const errData = await response.text();
            throw new Error(`Envíopack API Error: ${errData}`);
        }

        const data = await response.json();

        // Envíopack typically returns an order ID and label generation details
        return res.status(200).json({
            mode: 'official_api',
            success: true,
            tracking_id: data.codigo_seguimiento || `EP-${orderId}`,
            label_pdf_url: data.etiqueta_pdf || `https://api.enviopack.com/envios/${data.id}/etiqueta`
        });

    } catch (error) {
        console.error('Error in api/despachar:', error);
        return res.status(500).json({ error: 'Fallo al procesar el despacho del envío.', details: error.message });
    }
};

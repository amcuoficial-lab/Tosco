// Vercel Serverless Function: api/create-preference.js
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
        const { items, shippingCost, customer } = req.body || {};
        if (!items || !customer) {
            return res.status(400).json({ error: 'Faltan campos requeridos (items, customer).' });
        }

        const accessToken = process.env.MP_ACCESS_TOKEN;

        // Sandbox/Simulation Mode if no Token is configured
        if (!accessToken) {
            return res.status(200).json({
                mode: 'sandbox_simulation',
                success: true,
                init_point: `${req.headers.referer || '/'}?payment=success_simulated`
            });
        }

        // Map items to Mercado Pago format
        const mpItems = items.map(item => ({
            title: item.name,
            unit_price: Number(item.price),
            quantity: Number(item.quantity),
            currency_id: 'ARS',
            picture_url: item.image
        }));

        // Add shipping as a line item if greater than 0
        if (shippingCost && Number(shippingCost) > 0) {
            mpItems.push({
                title: 'Envío a Domicilio / Sucursal',
                unit_price: Number(shippingCost),
                quantity: 1,
                currency_id: 'ARS'
            });
        }

        const preferenceBody = {
            items: mpItems,
            payer: {
                name: customer.name,
                email: customer.email,
                phone: {
                    number: customer.phone
                },
                address: {
                    street_name: customer.address,
                    zip_code: customer.zip
                }
            },
            back_urls: {
                success: `${req.headers.origin}/index.html?payment=success`,
                failure: `${req.headers.origin}/index.html?payment=failure`,
                pending: `${req.headers.origin}/index.html?payment=pending`
            },
            auto_return: 'approved'
        };

        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(preferenceBody)
        });

        if (!response.ok) {
            const errData = await response.text();
            throw new Error(`Mercado Pago API Error: ${errData}`);
        }

        const data = await response.json();
        return res.status(200).json({
            mode: 'official_api',
            success: true,
            init_point: data.init_point
        });

    } catch (error) {
        console.error('Error in api/create-preference:', error);
        return res.status(500).json({ error: 'Fallo al procesar el pago con Mercado Pago.', details: error.message });
    }
};

// Vercel Serverless Function: api/send-otp.js
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
        return res.status(405).json({ error: 'Método no permitido.' });
    }

    try {
        const { email } = req.body || {};
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Un email válido es requerido.' });
        }

        const cleanEmail = email.trim().toLowerCase();
        
        // Generate random 6-digit OTP code
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        
        // Centralized Bucket ID for Tosco DB
        const bucketId = 'bucket_tosco_almacen_335196ff';
        
        // 1. Save email registration key (persists customer email permanently)
        await fetch(`https://kvdb.io/${bucketId}/tosco:email:${cleanEmail}`, {
            method: 'POST',
            body: new Date().toISOString()
        });

        // 2. Save temporary verification OTP (expires in KVdb if supported or we overwrite)
        await fetch(`https://kvdb.io/${bucketId}/tosco:otp:${cleanEmail}`, {
            method: 'POST',
            body: otp
        });

        // 3. Send email to customer (If Resend/SendGrid credentials are set, call them. 
        // Otherwise, in Sandbox/Demo mode, we return the code to the frontend for easy testing).
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${resendApiKey}`
                },
                body: JSON.stringify({
                    from: 'Tosco Almacén <onboarding@resend.dev>',
                    to: cleanEmail,
                    subject: `${otp} es tu código de verificación - Tosco`,
                    html: `<h3>¡Hola!</h3><p>Tu código de verificación para ingresar a Tosco Almacén de Moda es:</p><h1 style="font-size:32px; letter-spacing:2px; color:#2c3e50;">${otp}</h1><p>El código expirará en 10 minutos.</p>`
                })
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Código enviado correctamente.',
            // Return code for sandbox simulation if Resend is not configured yet
            code: resendApiKey ? null : otp 
        });

    } catch (error) {
        console.error('Error in api/send-otp:', error);
        return res.status(500).json({ error: 'Error al enviar el código OTP.', details: error.message });
    }
};

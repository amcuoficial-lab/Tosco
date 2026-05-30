// Vercel Serverless Function: api/verify-otp.js
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
        const { email, code } = req.body || {};
        if (!email || !code) {
            return res.status(400).json({ error: 'Email y código son requeridos.' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const bucketId = 'bucket_tosco_almacen_335196ff';

        // Fetch stored OTP
        const response = await fetch(`https://kvdb.io/${bucketId}/tosco:otp:${cleanEmail}`);
        if (!response.ok) {
            return res.status(400).json({ error: 'Código de verificación vencido o inexistente. Intente nuevamente.' });
        }

        const storedOtp = await response.text();

        if (storedOtp.trim() === code.trim()) {
            // Success! Delete OTP key to prevent reuse
            await fetch(`https://kvdb.io/${bucketId}/tosco:otp:${cleanEmail}`, {
                method: 'DELETE'
            });

            return res.status(200).json({
                success: true,
                message: 'Sesión iniciada correctamente.'
            });
        } else {
            return res.status(400).json({ error: 'El código de verificación ingresado es incorrecto.' });
        }

    } catch (error) {
        console.error('Error in api/verify-otp:', error);
        return res.status(500).json({ error: 'Fallo al verificar el código.', details: error.message });
    }
};

export async function healthCheck(req, res) {

    console.log('Health check endpoint called');

    res.status(200).json({ status: 'ok' });
}
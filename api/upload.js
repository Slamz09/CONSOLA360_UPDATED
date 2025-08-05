// api/upload.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end('Method Not Allowed')
  }

  try {
    // no JSON.parse, Vercel already gives you a JS object
    const { records } = req.body

    console.log('Received', records.length, 'records')
    // TODO: persist records to your database here

    return res
      .status(200)
      .json({ message: 'Upload successful', count: records.length })
  } catch (err) {
    console.error('Upload error:', err)
    return res.status(500).json({ error: err.message })
  }
}

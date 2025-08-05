// api/accounts.js
let store = []

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Save the uploaded rows
    store = req.body.records || []
    console.log('Stored', store.length, 'records')
    return res.status(200).json({ message: 'Upload successful', count: store.length })
  }

  if (req.method === 'GET') {
    // Return whatever we have
    return res.status(200).json(store)
  }

  res.setHeader('Allow', ['GET','POST'])
  res.status(405).end('Method Not Allowed')
}

// Simple health endpoint without Prisma
export default function handler(req, res) {
  res.status(200).send('OK');
}

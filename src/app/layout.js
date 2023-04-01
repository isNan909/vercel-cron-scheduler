import './globals.css'

export const metadata = {
  title: 'Vercel Cron Scheduler',
  description: 'A simple application making use of Cron jobs inside Vercel',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

import './globals.css'

export const metadata = {
  title: 'EasyMart – Shop Smarter',
  description: 'EasyMart: Your one-stop shop for electronics, fashion, home essentials, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

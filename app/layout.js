export const metadata = {
  title: 'Pumpensteuerung — Kiotra Demo',
  description: 'Live-Demo: Mobile Pumpensteuerung für Weinpumpen mit Yaskawa Frequenzumrichter',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body style={{margin:0, padding:0, background:'#f0f0ec', minHeight:'100vh', display:'flex', justifyContent:'center', alignItems:'flex-start', paddingTop:'20px', paddingBottom:'20px'}}>
        {children}
      </body>
    </html>
  )
}


import { AuthProvider } from '@/components/Providers';
import './globals.css';
import LayoutContent from './LayoutContent';

export const metadata = {
  title: 'Alliance-Agroforesterie',
  description: "Application web pour la visualisation des sites de référence et des locaux et des pépinières des institutions membre de l'Alliance-Agroforesterie avec cartographie interactive",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" style={{ height: '100%' }}>
      <head></head>
      <body style={{ height: '100%' }}>
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
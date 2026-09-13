import { useState, type ReactNode } from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/layout/Footer';
import SearchOverlay from '@/components/navigation/SearchOverlay';
import CartDrawer from '@/components/cart/CartDrawer';
import ScrollToTop from '@/components/navigation/ScrollToTop';

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export default function Layout({ children, hideFooter = false }: LayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-ivory-100">
      <ScrollToTop />
      <Navbar onSearchOpen={() => setSearchOpen(true)} onCartOpen={() => setCartOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}

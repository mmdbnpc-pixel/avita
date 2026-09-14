import { lazy, Suspense } from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { AdminProvider } from '@/context/AdminContext';
import SupportPage from '@/pages/Support/SupportPage';

import Layout from '@/components/layout/Layout';

import HomePage from '@/pages/Home/HomePage';
import NotFoundPage from '@/pages/NotFound/NotFoundPage';

/* =========================================================
   MAIN PAGES
   ========================================================= */

const ProductsPage = lazy(
  () =>
    import(
      '@/pages/Products/ProductsPage'
    )
);

const ProductDetailPage = lazy(
  () =>
    import(
      '@/pages/ProductDetail/ProductDetailPage'
    )
);

const CategoryPage = lazy(
  () =>
    import(
      '@/pages/Categories/CategoryPage'
    )
);

const CartPage = lazy(
  () =>
    import('@/pages/Cart/CartPage')
);

const CheckoutPage = lazy(
  () =>
    import(
      '@/pages/Checkout/CheckoutPage'
    )
);

const PaymentSuccessPage = lazy(
  () =>
    import(
      '@/pages/PaymentSuccess/PaymentSuccessPage'
    )
);

const LoginPage = lazy(
  () =>
    import('@/pages/Login/LoginPage')
);

const RegisterPage = lazy(
  () =>
    import(
      '@/pages/Register/RegisterPage'
    )
);

const ProfilePage = lazy(
  () =>
    import(
      '@/pages/Profile/ProfilePage'
    )
);

const AboutPage = lazy(
  () =>
    import('@/pages/About/AboutPage')
);

const ArticlesPage = lazy(
  () =>
    import(
      '@/pages/Articles/ArticlesPage'
    )
);

const ArticleDetailPage = lazy(
  () =>
    import(
      '@/pages/Articles/ArticleDetailPage'
    )
);

/* =========================================================
   ADMIN PAGES
   ========================================================= */

const AdminLayout = lazy(
  () =>
    import('@/pages/admin/AdminLayout')
);

const DashboardPage = lazy(
  () =>
    import(
      '@/pages/admin/DashboardPage'
    )
);

const AdminProductsPage = lazy(
  () =>
    import(
      '@/pages/admin/ProductsPage'
    )
);

const AdminArticlesPage = lazy(
  () =>
    import(
      '@/pages/admin/ArticlesPage'
    )
);

const AdminOrdersPage = lazy(
  () =>
    import(
      '@/pages/admin/OrdersPage'
    )
);

const AdminCollectionPage = lazy(
  () => import('@/pages/admin/CollectionPage')
);

/* =========================================================
   PAGE LOADER
   ========================================================= */

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ivory-300 border-t-navy-900" />
    </div>
  );
}

/* =========================================================
   APP
   ========================================================= */

export default function App() {
  return (
    <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <FavoritesProvider>
              <AdminProvider>
                <CartProvider>

                  <Suspense
                    fallback={
                      <PageLoader />
                    }
                  >
                    <Routes>

                      {/* ================================
                          AUTH
                          ================================ */}

                      <Route
                        path="/login"
                        element={
                          <LoginPage />
                        }
                      />

                      <Route
                        path="/register"
                        element={
                          <RegisterPage />
                        }
                      />

                      {/* ================================
                          ADMIN
                          ================================ */}

                      <Route
                        path="/admin"
                        element={
                          <AdminLayout />
                        }
                      >
                        <Route
                          index
                          element={
                            <DashboardPage />
                          }
                        />

                        <Route
                          path="products"
                          element={
                            <AdminProductsPage />
                          }
                        />

                        <Route
                          path="articles"
                          element={
                            <AdminArticlesPage />
                          }
                        />

                        <Route
                          path="orders"
                          element={
                            <AdminOrdersPage />
                          }
                        />

                        <Route
                          path="collection"
                          element={<AdminCollectionPage />}
                        />
                      </Route>

                      {/* ================================
                          WEBSITE
                          ================================ */}

                      <Route
                        path="/*"
                        element={
                          <Layout>
                            <Suspense
                              fallback={
                                <PageLoader />
                              }
                            >
                              <Routes>

                                <Route
                                  path="/"
                                  element={
                                    <HomePage />
                                  }
                                />

                                <Route
                                  path="/products"
                                  element={
                                    <ProductsPage />
                                  }
                                />

                                <Route
                                  path="/products/:id"
                                  element={
                                    <ProductDetailPage />
                                  }
                                />

                                <Route
                                  path="/category/:category"
                                  element={
                                    <CategoryPage />
                                  }
                                />

                                <Route
                                  path="/cart"
                                  element={
                                    <CartPage />
                                  }
                                />

                                <Route
                                  path="/checkout"
                                  element={
                                    <CheckoutPage />
                                  }
                                />

                                <Route
                                  path="/payment/success"
                                  element={
                                    <PaymentSuccessPage />
                                  }
                                />

                                <Route
                                  path="/profile"
                                  element={
                                    <ProfilePage />
                                  }
                                />

                                <Route
                                  path="/about"
                                  element={
                                    <AboutPage />
                                  }
                                />

                                <Route
                                  path="/articles"
                                  element={
                                    <ArticlesPage />
                                  }
                                />

                                <Route
                                  path="/articles/:id"
                                  element={
                                    <ArticleDetailPage />
                                  }
                                />

                                <Route
                                  path="*"
                                  element={
                                    <NotFoundPage />
                                  }
                                />
                              

                              <Route path="/support" element={<SupportPage />} />
                              </Routes>
                            </Suspense>
                          </Layout>
                        }
                      />

                    </Routes>
                  </Suspense>

                </CartProvider>
              </AdminProvider>
            </FavoritesProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
  );
}
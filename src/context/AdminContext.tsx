import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  products as initialProducts,
  reviews as initialReviews,
} from '@/data/products';

import { articles as initialArticles } from '@/data/articles';
import { mockOrders as initialOrders } from '@/data/orders';

import type {
  Article,
  Order,
  OrderStatus,
  Product,
  Review,
  SpecialCollectionItem,
} from '@/types';

interface AdminContextType {
  products: Product[];
  articles: Article[];
  orders: Order[];
  reviews: Review[];
  collectionItems: SpecialCollectionItem[];

  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Product) => void;
  deleteProduct: (id: string) => void;

  addArticle: (article: Article) => void;
  updateArticle: (id: string, article: Article) => void;
  deleteArticle: (id: string) => void;

  addOrder: (order: Order) => void;
  updateOrder: (
    id: string,
    changes: Partial<Order>
  ) => void;
  updateOrderStatus: (
    id: string,
    status: OrderStatus
  ) => void;

  addReview: (review: Review) => void;
  updateReview: (
    id: string,
    changes: Partial<Review>
  ) => void;
  deleteReview: (id: string) => void;
  getReviewsByProduct: (
    productId: string
  ) => Review[];

  addCollectionItem: (
    item: SpecialCollectionItem
  ) => void;

  updateCollectionItem: (
    id: string,
    changes: Partial<SpecialCollectionItem>
  ) => void;

  deleteCollectionItem: (id: string) => void;

  moveCollectionItem: (
    id: string,
    direction: 'up' | 'down'
  ) => void;

  getProductById: (
    id: string
  ) => Product | undefined;

  getProductBySlug: (
    slug: string
  ) => Product | undefined;

  getRelatedProducts: (
    product: Product,
    count?: number
  ) => Product[];

  getFeaturedProducts: () => Product[];
  getNewProducts: () => Product[];
  getBestsellers: () => Product[];

  getProductsByCategory: (
    category: string
  ) => Product[];

  getArticleById: (
    id: string
  ) => Article | undefined;

  getArticleBySlug: (
    slug: string
  ) => Article | undefined;

  getRelatedArticles: (
    article: Article,
    count?: number
  ) => Article[];

  resetAdminData: () => void;
}

const AdminContext =
  createContext<AdminContextType | undefined>(
    undefined
  );

const PRODUCTS_KEY =
  'avita-admin-products';

const ARTICLES_KEY =
  'avita-admin-articles';

const ORDERS_KEY =
  'avita-admin-orders';

const REVIEWS_KEY =
  'avita-admin-reviews';

const COLLECTION_KEY =
  'avita-admin-special-collection';

function readStorage<T>(
  key: string,
  fallback: T[]
): T[] {
  try {
    const value =
      localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    const parsed = JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed
      : fallback;
  } catch {
    return fallback;
  }
}

function createId(
  prefix: string
) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

/*
 * وضعیت سفارش‌ها بدون تغییر نگه داشته می‌شوند.
 *
 * مهم:
 * pending_payment نباید به preparing تبدیل شود،
 * چون باید در پنل ادمین به عنوان
 * «در انتظار پرداخت» نمایش داده شود.
 */
function normalizeOrders(
  orders: Order[]
): Order[] {
  return orders;
}

function defaultCollectionItems():
  SpecialCollectionItem[] {
  return initialProducts
    .filter(
      (product) => product.featured
    )
    .map((product, index) => ({
      id: `collection-${product.id}`,
      productId: product.id,
      image: product.images[0],
      title: product.name,
      text: product.description,
      order: index,
    }));
}

export function AdminProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [products, setProducts] =
    useState<Product[]>(
      () =>
        readStorage(
          PRODUCTS_KEY,
          initialProducts
        )
    );

  const [articles, setArticles] =
    useState<Article[]>(
      () =>
        readStorage(
          ARTICLES_KEY,
          initialArticles
        )
    );

  const [orders, setOrders] =
    useState<Order[]>(
      () =>
        normalizeOrders(
          readStorage(
            ORDERS_KEY,
            initialOrders
          )
        )
    );

  const [reviews, setReviews] =
    useState<Review[]>(
      () =>
        readStorage(
          REVIEWS_KEY,
          initialReviews
        )
    );

  const [collectionItems, setCollectionItems] =
    useState<SpecialCollectionItem[]>(
      () =>
        readStorage(
          COLLECTION_KEY,
          defaultCollectionItems()
        )
    );

  /*
   * ذخیره اطلاعات در LocalStorage
   */
  useEffect(() => {
    localStorage.setItem(
      PRODUCTS_KEY,
      JSON.stringify(products)
    );
  }, [products]);

  useEffect(() => {
    localStorage.setItem(
      ARTICLES_KEY,
      JSON.stringify(articles)
    );
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(
      ORDERS_KEY,
      JSON.stringify(orders)
    );
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(
      REVIEWS_KEY,
      JSON.stringify(reviews)
    );
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(
      COLLECTION_KEY,
      JSON.stringify(collectionItems)
    );
  }, [collectionItems]);

  /*
   * Products
   */
  const addProduct = (
    product: Product
  ) => {
    setProducts((current) => [
      {
        ...product,
        id:
          product.id ||
          createId('product'),
      },
      ...current,
    ]);
  };

  const updateProduct = (
    id: string,
    product: Product
  ) => {
    setProducts((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...product,
              id,
            }
          : item
      )
    );
  };

  const deleteProduct = (
    id: string
  ) => {
    setProducts((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );

    setCollectionItems((current) =>
      current.filter(
        (item) => item.productId !== id
      )
    );
  };

  /*
   * Articles
   */
  const addArticle = (
    article: Article
  ) => {
    setArticles((current) => [
      {
        ...article,
        id:
          article.id ||
          createId('article'),
      },
      ...current,
    ]);
  };

  const updateArticle = (
    id: string,
    article: Article
  ) => {
    setArticles((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...article,
              id,
            }
          : item
      )
    );
  };

  const deleteArticle = (
    id: string
  ) => {
    setArticles((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  };

  /*
   * Orders
   *
   * وضعیت سفارش دقیقاً همان چیزی است
   * که هنگام ایجاد سفارش ارسال شده است.
   *
   * بنابراین:
   * pending_payment
   * paid
   * pending
   * preparing
   * shipped
   * delivered
   * cancelled
   *
   * همگی حفظ می‌شوند.
   */
  const addOrder = (
    order: Order
  ) => {
    setOrders((current) => [
      {
        ...order,
        id:
          order.id ||
          createId('order'),
      },
      ...current,
    ]);
  };

  /*
   * تغییر هر بخشی از سفارش
   *
   * این تابع باعث می‌شود تغییر وضعیت،
   * کد رهگیری و سایر اطلاعات سفارش
   * همزمان در تمام بخش‌های سایت
   * قابل مشاهده باشد.
   */
  const updateOrder = (
    id: string,
    changes: Partial<Order>
  ) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === id
          ? {
              ...order,
              ...changes,
            }
          : order
      )
    );
  };

  const updateOrderStatus = (
    id: string,
    status: OrderStatus
  ) => {
    updateOrder(id, {
      status,
    });
  };

  /*
   * Reviews
   */
  const syncProductReviewStats = (
    nextReviews: Review[]
  ) => {
    setProducts((current) =>
      current.map((product) => {
        const productReviews =
          nextReviews.filter(
            (review) =>
              review.productId ===
              product.id
          );

        if (!productReviews.length) {
          return {
            ...product,
            reviewCount: 0,
            rating: 0,
          };
        }

        const rating =
          productReviews.reduce(
            (sum, review) =>
              sum + review.rating,
            0
          ) /
          productReviews.length;

        return {
          ...product,
          reviewCount:
            productReviews.length,
          rating:
            Number(rating.toFixed(1)),
        };
      })
    );
  };

  const addReview = (
    review: Review
  ) => {
    setReviews((current) => {
      const next = [
        {
          ...review,
          id:
            review.id ||
            createId('review'),
        },
        ...current,
      ];

      syncProductReviewStats(next);

      return next;
    });
  };

  const updateReview = (
    id: string,
    changes: Partial<Review>
  ) => {
    setReviews((current) => {
      const next = current.map(
        (review) =>
          review.id === id
            ? {
                ...review,
                ...changes,
              }
            : review
      );

      syncProductReviewStats(next);

      return next;
    });
  };

  const deleteReview = (
    id: string
  ) => {
    setReviews((current) => {
      const next =
        current.filter(
          (review) =>
            review.id !== id
        );

      syncProductReviewStats(next);

      return next;
    });
  };

  /*
   * Special Collection
   */
  const addCollectionItem = (
    item: SpecialCollectionItem
  ) => {
    setCollectionItems((current) => [
      ...current,
      {
        ...item,
        id:
          item.id ||
          createId('collection'),
        order: current.length,
      },
    ]);
  };

  const updateCollectionItem = (
    id: string,
    changes: Partial<SpecialCollectionItem>
  ) => {
    setCollectionItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...changes,
            }
          : item
      )
    );
  };

  const deleteCollectionItem = (
    id: string
  ) => {
    setCollectionItems((current) =>
      current
        .filter(
          (item) => item.id !== id
        )
        .map((item, index) => ({
          ...item,
          order: index,
        }))
    );
  };

  const moveCollectionItem = (
    id: string,
    direction: 'up' | 'down'
  ) => {
    setCollectionItems((current) => {
      const sorted = [...current].sort(
        (a, b) =>
          a.order - b.order
      );

      const index =
        sorted.findIndex(
          (item) => item.id === id
        );

      const target =
        direction === 'up'
          ? index - 1
          : index + 1;

      if (
        index < 0 ||
        target < 0 ||
        target >= sorted.length
      ) {
        return current;
      }

      [
        sorted[index],
        sorted[target],
      ] = [
        sorted[target],
        sorted[index],
      ];

      return sorted.map(
        (item, nextIndex) => ({
          ...item,
          order: nextIndex,
        })
      );
    });
  };

  /*
   * Reset
   */
  const resetAdminData = () => {
    setProducts(initialProducts);
    setArticles(initialArticles);
    setOrders(
      normalizeOrders(initialOrders)
    );
    setReviews(initialReviews);
    setCollectionItems(
      defaultCollectionItems()
    );
  };

  const value =
    useMemo<AdminContextType>(
      () => ({
        products,
        articles,
        orders,
        reviews,
        collectionItems,

        addProduct,
        updateProduct,
        deleteProduct,

        addArticle,
        updateArticle,
        deleteArticle,

        addOrder,
        updateOrder,
        updateOrderStatus,

        addReview,
        updateReview,
        deleteReview,

        getReviewsByProduct: (
          productId
        ) =>
          reviews.filter(
            (review) =>
              review.productId ===
              productId
          ),

        addCollectionItem,
        updateCollectionItem,
        deleteCollectionItem,
        moveCollectionItem,

        getProductById: (id) =>
          products.find(
            (product) =>
              product.id === id
          ),

        getProductBySlug: (slug) =>
          products.find(
            (product) =>
              product.slug === slug
          ),

        getRelatedProducts: (
          product,
          count = 4
        ) =>
          products
            .filter(
              (item) =>
                item.id !== product.id &&
                (
                  item.category ===
                    product.category ||
                  item.gender ===
                    product.gender
                )
            )
            .slice(0, count),

        getFeaturedProducts: () =>
          products.filter(
            (product) =>
              product.featured
          ),

        getNewProducts: () =>
          products.filter(
            (product) =>
              product.isNew
          ),

        getBestsellers: () =>
          products.filter(
            (product) =>
              product.isBestseller
          ),

        getProductsByCategory: (
          category
        ) =>
          products.filter(
            (product) =>
              product.category ===
              category
          ),

        getArticleById: (id) =>
          articles.find(
            (article) =>
              article.id === id
          ),

        getArticleBySlug: (slug) =>
          articles.find(
            (article) =>
              article.slug === slug
          ),

        getRelatedArticles: (
          article,
          count = 3
        ) =>
          articles
            .filter(
              (item) =>
                item.id !== article.id &&
                item.published
            )
            .slice(0, count),

        resetAdminData,
      }),
      [
        products,
        articles,
        orders,
        reviews,
        collectionItems,
        addReview,
        updateReview,
        deleteReview,
        updateOrderStatus,
      ]
    );

  return (
    <AdminContext.Provider
      value={value}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context =
    useContext(AdminContext);

  if (!context) {
    throw new Error(
      'useAdmin must be used inside AdminProvider'
    );
  }

  return context;
}
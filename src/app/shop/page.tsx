'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { ShoppingBag, Star, Crown, Sparkles, Check, Gift } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  type: 'subscription' | 'course' | 'bundle';
  features: string[];
  popular?: boolean;
}

const products: Product[] = [
  {
    id: 'premium_month',
    title: 'Premium месяц',
    description: 'Полный доступ на 30 дней',
    price: 499,
    type: 'subscription',
    features: [
      'Все программы и курсы',
      'Персональные рекомендации',
      'Расширенная аналитика',
      'Приоритетная поддержка',
    ],
    popular: true,
  },
  {
    id: 'premium_year',
    title: 'Premium год',
    description: 'Выгода 40%',
    price: 2990,
    originalPrice: 5988,
    type: 'subscription',
    features: [
      'Всё из месячной подписки',
      'Эксклюзивные программы',
      'Личные консультации',
      'Ранний доступ к новинкам',
    ],
  },
  {
    id: 'course_hormones',
    title: 'Гормональный баланс',
    description: 'Курс на 28 дней',
    price: 1490,
    type: 'course',
    features: [
      '28 ежедневных практик',
      'Синхронизация с циклом',
      'Видео-уроки',
      'Пожизненный доступ',
    ],
  },
  {
    id: 'bundle_start',
    title: 'Стартовый набор',
    description: '3 курса по цене 2',
    price: 2490,
    originalPrice: 3990,
    type: 'bundle',
    features: [
      'Антистресс (7 дней)',
      'Здоровый сон (14 дней)',
      'Энергия (10 дней)',
      'Бонус: гайд по питанию',
    ],
  },
];

const typeLabels: Record<string, string> = {
  subscription: 'Подписка',
  course: 'Курс',
  bundle: 'Набор',
};

const typeColors: Record<string, string> = {
  subscription: 'bg-aura-lavender-light text-aura-lavender-dark',
  course: 'bg-aura-mint-light text-aura-mint-dark',
  bundle: 'bg-aura-peach-light text-aura-peach-dark',
};

export default function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-background pb-tab-bar">
      {/* Header */}
      <header className="px-5 pt-4 pb-4 safe-area-top">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-aura-peach to-aura-peach-dark flex items-center justify-center">
            <ShoppingBag size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">Магазин</h1>
            <p className="text-xs text-aura-slate/60">Подписки и курсы</p>
          </div>
        </div>

        {/* Promo banner */}
        <div className="card p-4 bg-gradient-to-r from-aura-lavender to-aura-mint">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/30 flex items-center justify-center">
              <Gift size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Первая неделя бесплатно!</h3>
              <p className="text-sm text-white/80">Попробуй Premium без оплаты</p>
            </div>
          </div>
        </div>
      </header>

      {/* Products */}
      <main className="px-5 py-4 space-y-4">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className={`w-full card p-4 text-left transition-transform active:scale-[0.99] ${
              product.popular ? 'ring-2 ring-aura-mint' : ''
            }`}
          >
            {product.popular && (
              <div className="flex items-center gap-1 mb-2">
                <Star size={12} className="text-aura-mint fill-aura-mint" />
                <span className="text-xs font-medium text-aura-mint-dark">Популярный выбор</span>
              </div>
            )}

            <div className="flex items-start justify-between mb-2">
              <div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[product.type]}`}>
                  {typeLabels[product.type]}
                </span>
                <h3 className="font-semibold text-foreground mt-2">{product.title}</h3>
                <p className="text-sm text-aura-slate/60">{product.description}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-foreground">{product.price} <span className="text-sm font-normal">р</span></div>
                {product.originalPrice && (
                  <div className="text-sm text-aura-slate/40 line-through">{product.originalPrice} р</div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {product.features.slice(0, 2).map((feature, i) => (
                <span key={i} className="text-xs text-aura-slate/60 flex items-center gap-1">
                  <Check size={10} className="text-aura-mint" />
                  {feature}
                </span>
              ))}
              {product.features.length > 2 && (
                <span className="text-xs text-aura-mint-dark">+{product.features.length - 2}</span>
              )}
            </div>
          </button>
        ))}
      </main>

      {/* Product detail modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up safe-area-bottom">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[selectedProduct.type]}`}>
                    {typeLabels[selectedProduct.type]}
                  </span>
                  <h3 className="font-bold text-xl text-foreground mt-2">{selectedProduct.title}</h3>
                  <p className="text-sm text-aura-slate/60">{selectedProduct.description}</p>
                </div>
                {selectedProduct.popular && (
                  <Crown size={24} className="text-aura-mint" />
                )}
              </div>

              <div className="space-y-3 mb-6">
                {selectedProduct.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-aura-mint-light flex items-center justify-center">
                      <Check size={14} className="text-aura-mint-dark" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="card-soft p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-aura-slate/60">Итого:</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{selectedProduct.price} р</div>
                    {selectedProduct.originalPrice && (
                      <div className="text-sm text-aura-slate/40 line-through">{selectedProduct.originalPrice} р</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 btn-secondary"
                >
                  Закрыть
                </button>
                <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Sparkles size={18} />
                  Купить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}

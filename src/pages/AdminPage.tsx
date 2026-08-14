import React, { useState } from 'react';
import { useApp } from '@/src/context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatCurrency } from '../lib/utils';
import { ShieldAlert, Zap, Edit3, Plus, RefreshCw, Terminal, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

export function AdminPage() {
  const { products, adminUpdateProductPrice, adminUpdateStock, triggerLiveDropSimulation, adminAddProduct, settings } = useApp();
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [newPrice, setNewPrice] = useState<number>(75000);
  const [storeName, setStoreName] = useState<string>('Amazon');

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(25000);
  const [newProdCategory, setNewProdCategory] = useState<'pc_hardware' | 'console' | 'game' | 'accessory'>('pc_hardware');

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handlePriceUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    adminUpdateProductPrice(selectedProductId, newPrice, storeName);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const prod: Product = {
      id: `p_custom_${Date.now()}`,
      name: newProdName,
      brand: newProdBrand || 'Custom Brand',
      category: newProdCategory,
      subCategory: 'Custom Equipment',
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=600&h=600',
      currentPrice: newProdPrice,
      originalPrice: Math.round(newProdPrice * 1.2),
      lowestPrice: newProdPrice,
      averagePrice: newProdPrice,
      highestPrice: Math.round(newProdPrice * 1.2),
      dealScore: 85,
      stockStatus: 'In Stock',
      store: 'Amazon',
      updatedAt: 'Just now'
    };

    adminAddProduct(prod);
    setNewProdName('');
    setNewProdBrand('');
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400 font-mono mb-1">
          <ShieldAlert className="h-4 w-4 text-rose-500" />
          <span>Internal Commerce Simulator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-100">
          Admin & Event Simulator Terminal
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Test real-time drop feeds, price alerts, restock triggers, and catalog state modifications.
        </p>
      </div>

      {/* Simulator Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price & Stock Modifier */}
        <Card className="bg-[#0D0F12] border-gray-800 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
            <Edit3 className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wider">
              Force Modify Product Price / Drop
            </h3>
          </div>

          <form onSubmit={handlePriceUpdate} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Select Product to Alter</label>
              <select
                value={selectedProductId}
                onChange={e => {
                  setSelectedProductId(e.target.value);
                  const p = products.find(prod => prod.id === e.target.value);
                  if (p) setNewPrice(p.currentPrice);
                }}
                className="w-full h-9 rounded-lg border border-gray-800 bg-[#12151A] px-3 text-xs text-gray-200 focus:outline-none"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({formatCurrency(p.currentPrice, settings.currency)})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">New Ingested Price</label>
                <Input
                  type="number"
                  value={newPrice}
                  onChange={e => setNewPrice(Number(e.target.value))}
                  className="font-mono text-sm bg-[#12151A]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Retailer Source</label>
                <select
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  className="w-full h-9 rounded-lg border border-gray-800 bg-[#12151A] px-3 text-xs text-gray-200"
                >
                  <option value="Amazon">Amazon</option>
                  <option value="Flipkart">Flipkart</option>
                  <option value="MDComputers">MDComputers</option>
                  <option value="PrimeABGB">PrimeABGB</option>
                  <option value="Steam">Steam</option>
                  <option value="PlayStation Store">PlayStation Store</option>
                </select>
              </div>
            </div>

            {/* Quick Stock Status Modifier */}
            {selectedProduct && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-gray-400">Stock Status:</span>
                {(['In Stock', 'Limited', 'Out of Stock', 'Pre-order'] as const).map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => adminUpdateStock(selectedProduct.id, st)}
                    className={`px-2 py-1 text-[11px] rounded transition-colors ${
                      selectedProduct.stockStatus === st ? 'bg-emerald-500 text-black font-bold' : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}

            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs h-9">
              <Zap className="h-3.5 w-3.5 mr-1" /> Broadcast Price Change Event
            </Button>
          </form>
        </Card>

        {/* Global Live Simulation Trigger */}
        <Card className="bg-[#0D0F12] border-gray-800 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3 mb-4">
              <Zap className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wider">
                Instant Event Stream Generator
              </h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Pushes randomized price drops, discounts (5% to 25%), or restock events into the live pipeline. This validates toast notifications, watchlist trigger logic, and activity tickers.
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={triggerLiveDropSimulation}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs h-10"
            >
              ⚡ Generate Random Flash Drop Event
            </Button>
          </div>
        </Card>
      </div>

      {/* Catalog Injector */}
      <Card className="bg-[#0D0F12] border-gray-800 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          <Plus className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wider">
            Inject Custom Product to Catalog
          </h3>
        </div>

        <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Product Name</label>
            <Input
              placeholder="e.g. RTX 5090 Suprim X"
              value={newProdName}
              onChange={e => setNewProdName(e.target.value)}
              className="text-xs bg-[#12151A]"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Brand</label>
            <Input
              placeholder="e.g. MSI"
              value={newProdBrand}
              onChange={e => setNewProdBrand(e.target.value)}
              className="text-xs bg-[#12151A]"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Price (₹ INR)</label>
            <Input
              type="number"
              value={newProdPrice}
              onChange={e => setNewProdPrice(Number(e.target.value))}
              className="text-xs font-mono bg-[#12151A]"
            />
          </div>

          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs h-9">
            Add Product to DB
          </Button>
        </form>
      </Card>
    </div>
  );
}

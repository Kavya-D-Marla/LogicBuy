import { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Zap, Search, Coins, ArrowRight, ShieldCheck, ListOrdered, BarChart3 } from 'lucide-react';
import products from '../data/products.json';
import { knapsack01 } from '../utils/algorithms';
import ProductCard from '../components/ProductCard';

export default function SmartAssistantPage() {
  const [budget, setBudget] = useState(5000);
  const [knapsackResult, setKnapsackResult] = useState(null);

  const handleKnapsack = () => {
    // Run 0/1 Knapsack Algorithm
    const result = knapsack01(products, budget);
    setKnapsackResult(result);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <div className="text-center max-w-xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-pink/10 text-pink mb-4"
        >
          <BrainCircuit size={28} />
        </motion.div>
        <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black mb-3 leading-tight tracking-tight">Smart Shopping Assistant</h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Experience the power of Design and Analysis of Algorithms (DAA) applied to modern e-commerce.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Demo: 0/1 Knapsack */}
        <div className="lg:col-span-2 space-y-8">
          <section className="p-6 md:p-8 rounded-2xl bg-surface/80 backdrop-blur-md border border-border-light shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 md:mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Coins className="text-warning" size={24} />
                  <h2 className="font-heading text-xl md:text-2xl font-bold tracking-tight">Budget Optimizer</h2>
                </div>
                <p className="text-sm text-muted-foreground">0/1 Knapsack Algorithm (Dynamic Programming)</p>
              </div>
              <div className="inline-flex px-3 py-1.5 bg-surface-hover rounded-lg text-[11px] md:text-xs font-mono font-medium self-start md:self-auto">
                Time: O(N*W) | Space: O(N*W)
              </div>
            </div>

            <div className="bg-background/50 rounded-2xl p-5 md:p-6 border border-border-light mb-6 md:mb-8 shadow-inner">
              <label className="block text-sm font-semibold mb-3">What's your maximum budget?</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">₹</span>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 md:py-3 rounded-xl border border-border focus:border-pink focus:ring-2 focus:ring-pink/20 outline-none font-bold text-base md:text-lg transition-all bg-surface"
                    min="1000"
                    step="500"
                  />
                </div>
                <button
                  onClick={handleKnapsack}
                  className="px-6 md:px-8 py-2.5 md:py-3 rounded-xl gradient-bg text-white font-semibold whitespace-nowrap hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center"
                >
                  Optimize
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed max-w-xl">
                The Knapsack algorithm finds the optimal combination of products that maximizes total value (rating & discount) without exceeding your budget.
              </p>
            </div>

            {knapsackResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                    <p className="text-xs font-bold text-success uppercase mb-1">Total Items</p>
                    <p className="text-2xl font-black text-success">{knapsackResult.selectedItems.length}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-pink/10 border border-pink/20">
                    <p className="text-xs font-bold text-pink uppercase mb-1">Total Cost</p>
                    <p className="text-2xl font-black text-pink">₹{knapsackResult.totalCost}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-purple/10 border border-purple/20">
                    <p className="text-xs font-bold text-purple uppercase mb-1">Remaining</p>
                    <p className="text-2xl font-black text-purple">₹{budget - knapsackResult.totalCost}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
                    <p className="text-xs font-bold text-warning uppercase mb-1">Maximized Value</p>
                    <p className="text-2xl font-black text-warning">{knapsackResult.maxValue} pts</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-4">Optimized Selection:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {knapsackResult.selectedItems.map((item, idx) => (
                      <ProductCard key={item.id} product={item} index={idx} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </section>

          {/* Educational Section */}
          <section className="p-6 md:p-8 rounded-2xl bg-neutral-900 text-white shadow-sm overflow-hidden relative">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-pink/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <h2 className="font-heading text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 tracking-tight">
              <BarChart3 className="text-pink" size={24} /> Algorithm Implementations
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex flex-col h-full">
                <h3 className="font-semibold text-base flex items-center gap-2 mb-2">
                  <ListOrdered size={16} className="text-purple" /> Sorting Algorithms
                </h3>
                <p className="text-xs text-neutral-400 mb-4 leading-relaxed">Check out the Shop page to see these in action when filtering.</p>
                <div className="mt-auto space-y-2.5 text-xs">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span><span className="font-medium text-pink">Quick Sort:</span> Price Low/High</span>
                    <span className="font-mono text-[10px] bg-black/30 px-1.5 py-0.5 rounded text-neutral-400">O(N log N)</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span><span className="font-medium text-purple">Merge Sort:</span> Ratings</span>
                    <span className="font-mono text-[10px] bg-black/30 px-1.5 py-0.5 rounded text-neutral-400">O(N log N)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span><span className="font-medium text-warning">Heap Sort:</span> Discounts</span>
                    <span className="font-mono text-[10px] bg-black/30 px-1.5 py-0.5 rounded text-neutral-400">O(N log N)</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex flex-col h-full">
                <h3 className="font-semibold text-base flex items-center gap-2 mb-2">
                  <Search size={16} className="text-info" /> Binary Search
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">Used in the Search Overlay. Requires pre-sorting the product list by title to achieve <span className="font-mono text-pink bg-pink/10 px-1 rounded">O(log N)</span> search complexity.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 flex flex-col h-full">
          <div className="flex-1 p-6 rounded-2xl gradient-bg text-white shadow-lg relative overflow-hidden hover:shadow-xl transition-shadow flex flex-col justify-center">
            <h3 className="font-heading text-lg font-bold mb-2 relative z-10 tracking-tight">Greedy Offers</h3>
            <p className="text-white/90 text-xs leading-relaxed mb-4 relative z-10 max-w-[90%]">
              Add items to your cart to see the Greedy Algorithm automatically apply the best coupon combination.
            </p>
            <div className="absolute -bottom-4 -right-4 opacity-20 pointer-events-none transform rotate-12"><Zap size={120} /></div>
          </div>

          <div className="flex-[2] p-6 rounded-2xl bg-surface border border-border-light shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <h3 className="font-heading text-lg font-bold mb-3 flex items-center gap-2 tracking-tight">
              <BrainCircuit className="text-pink" size={20} /> DP Recommendations
            </h3>
            <p className="text-muted-foreground text-xs leading-relaxed mb-5">
              Visit any Product Detail page to see Dynamic Programming at work. It uses a variation of the Longest Common Subsequence concept to score products based on tag overlaps and feature similarity.
            </p>
            <div className="mt-auto p-4 bg-background/50 rounded-xl border border-border-light text-xs">
              <p className="font-semibold mb-2 text-foreground">Scoring Matrix:</p>
              <ul className="space-y-1.5 text-muted-foreground">
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-pink"></span> Category Match: +5 pts</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple"></span> Brand Match: +4 pts</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-warning"></span> Price Proximity: +1 to +3 pts</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-success"></span> Tag Overlap: +2 pts per tag</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

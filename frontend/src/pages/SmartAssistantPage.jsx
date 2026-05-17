import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Zap, Search, Coins, ArrowRight, ShieldCheck, ListOrdered, BarChart3, TrendingUp, Sparkles, SlidersHorizontal, Calculator, ChevronDown, ChevronUp, Network, GitMerge, ArrowDownWideNarrow, Binary } from 'lucide-react';
import products from '../data/products.json';
import { knapsack01 } from '../utils/algorithms';
import ProductCard from '../components/ProductCard';
import AlgorithmChatbot from '../components/AlgorithmChatbot';

export default function SmartAssistantPage() {
  const [budget, setBudget] = useState(5000);
  const [knapsackResult, setKnapsackResult] = useState(null);
  const [showSortingDetails, setShowSortingDetails] = useState(false);

  const handleKnapsack = () => {
    // Run 0/1 Knapsack Algorithm
    const result = knapsack01(products, budget);
    setKnapsackResult(result);
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="myntra-container lg:py-16" style={{ paddingTop: '60px' }}>
        
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto" style={{ marginBottom: '80px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink/10 text-pink mb-6 shadow-sm"
          >
            <BrainCircuit size={32} />
          </motion.div>
          <h1 className="font-heading text-4xl lg:text-5xl font-black mb-5 text-foreground tracking-tight leading-tight">
            Smart Shopping Assistant
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-medium">
            Experience the power of Design and Analysis of Algorithms (DAA) applied to modern e-commerce.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Demo: 0/1 Knapsack (Budget Optimizer) */}
          <div className="lg:col-span-2">
            <section className="p-8 md:p-10 rounded-2xl bg-surface border border-border shadow-sm mb-10">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Binary className="text-purple-600" size={20} />
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">Algorithm Implementations</h2>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calculator size={14} /> 0/1 Knapsack Algorithm (Dynamic Programming)
                  </p>
                </div>
                <div className="inline-flex px-3 py-1.5 bg-surface-hover rounded-lg text-xs font-mono font-semibold text-foreground self-start md:self-auto border border-border">
                  Time: O(N*W) | Space: O(N*W)
                </div>
              </div>

              <div 
                className="bg-surface-hover rounded-2xl border border-border shadow-sm"
                style={{ padding: '32px', marginTop: '56px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <label className="text-lg font-bold text-foreground">What's your maximum budget?</label>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <div className="relative flex-1">
                    <span 
                      className="absolute top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg pointer-events-none" 
                      style={{ left: '20px' }}
                    >
                      ₹
                    </span>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-pink/20 focus:border-pink font-bold transition-all"
                      style={{ padding: '16px 24px 16px 52px', minHeight: '60px' }}
                      min="1000"
                      step="500"
                    />
                  </div>
                  <button
                    onClick={handleKnapsack}
                    className="rounded-xl text-white font-bold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    style={{ backgroundColor: '#ff3f6c', padding: '16px 40px', minHeight: '60px' }}
                  >
                    <SlidersHorizontal size={20} /> Optimize
                  </button>
                </div>
                
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                  The Knapsack algorithm finds the optimal combination of products that maximizes total value (rating & discount) without exceeding your budget.
                </p>
              </div>

              {knapsackResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-5 rounded-xl bg-green-50 border border-green-100 flex flex-col items-center text-center">
                      <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Total Items</p>
                      <p className="text-3xl font-black text-green-600">{knapsackResult.selectedItems.length}</p>
                    </div>
                    <div className="p-5 rounded-xl bg-pink/10 border border-pink/20 flex flex-col items-center text-center">
                      <p className="text-xs font-bold text-pink-dark uppercase tracking-wider mb-1">Total Cost</p>
                      <p className="text-3xl font-black text-pink">₹{knapsackResult.totalCost}</p>
                    </div>
                    <div className="p-5 rounded-xl bg-purple-50 border border-purple-100 flex flex-col items-center text-center">
                      <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">Remaining</p>
                      <p className="text-3xl font-black text-purple-600">₹{budget - knapsackResult.totalCost}</p>
                    </div>
                    <div className="p-5 rounded-xl bg-orange-50 border border-orange-100 flex flex-col items-center text-center">
                      <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">Max Value</p>
                      <p className="text-3xl font-black text-orange-500">{knapsackResult.maxValue} pts</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <Sparkles size={20} className="text-pink" /> Optimized Selection
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {knapsackResult.selectedItems.map((item, idx) => (
                        <ProductCard key={item.id} product={item} index={idx} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </section>

            {/* Educational Section (Sorting & Binary Search) */}
            <section 
              className="rounded-2xl bg-surface border border-border shadow-lg overflow-hidden relative"
              style={{ padding: '40px' }}
            >
              <h2 
                className="font-heading text-2xl md:text-3xl font-bold flex items-center gap-3 tracking-tight text-foreground"
                style={{ marginBottom: '32px' }}
              >
                <BarChart3 className="text-pink" size={28} /> Algorithm Implementations
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 relative z-10" style={{ gap: '24px' }}>
                {/* Sorting Card */}
                <div 
                  className="rounded-xl bg-surface-hover border border-border transition-colors flex flex-col h-full shadow-sm"
                  style={{ padding: '24px' }}
                >
                  <h3 className="text-lg font-bold text-foreground">Sorting Algorithms</h3>
                  <p className="text-sm text-muted-foreground">Check out the Shop page to see these in action when filtering.</p>
                  
                  <ul className="mt-auto space-y-3">
                      <li className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
                        <span className="text-sm font-medium text-foreground"><span className="text-pink font-bold">Quick Sort:</span> Price Low/High</span>
                        <span className="text-xs font-mono text-muted-foreground bg-surface-hover px-2 py-0.5 rounded">O(N log N)</span>
                      </li>
                      <li className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
                        <span className="text-sm font-medium text-foreground"><span className="text-purple-600 font-bold">Merge Sort:</span> Ratings</span>
                        <span className="text-xs font-mono text-muted-foreground bg-surface-hover px-2 py-0.5 rounded">O(N log N)</span>
                      </li>
                      <li className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
                        <span className="text-sm font-medium text-foreground"><span className="text-orange-500 font-bold">Heap Sort:</span> Discounts</span>
                        <span className="text-xs font-mono text-muted-foreground bg-surface-hover px-2 py-0.5 rounded">O(N log N)</span>
                      </li>
                  </ul>
                  
                  <button 
                    onClick={() => setShowSortingDetails(!showSortingDetails)}
                    className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-xs font-bold text-foreground bg-surface-hover hover:bg-border/50 border border-border rounded-lg transition-colors"
                  >
                    {showSortingDetails ? 'Hide Details' : 'See How It Works'}
                    {showSortingDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* Binary Search Card */}
                <div 
                  className="rounded-xl bg-surface-hover border border-border transition-colors flex flex-col h-full shadow-sm"
                  style={{ padding: '24px' }}
                >
                  <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <Search size={20} className="text-blue-500" /> Binary Search
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-4">
                    Used in the Search Overlay to provide ultra-fast product discovery.
                  </p>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed mt-auto">
                    Requires pre-sorting the product list by title to achieve a <span className="font-mono font-bold text-pink bg-pink/10 px-1.5 py-0.5 rounded">O(log N)</span> search complexity, making it extremely efficient for massive catalogs.
                  </p>
                </div>
              </div>

              <AnimatePresence>
                {showSortingDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: '24px' }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-xl bg-surface-hover border border-border relative z-10" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                      
                      {/* Quick Sort Detail */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="flex items-center gap-3">
                           <ArrowDownWideNarrow className="text-pink" size={24} />
                           <h4 className="text-xl font-bold text-foreground">Quick Sort (Price)</h4>
                        </div>
                        <p className="text-base text-muted-foreground leading-relaxed">
                          We use Quick Sort for Price filtering because of its exceptional average-case performance. It works by selecting a <strong>"pivot"</strong> product (usually the median price) and partitioning the remaining products into two arrays: those cheaper than the pivot and those more expensive. This process is recursively applied to the sub-arrays.
                        </p>
                        <div className="bg-background rounded-lg border border-border font-mono text-sm text-muted-foreground" style={{ padding: '20px', lineHeight: '1.8' }}>
                          <span className="text-pink font-bold">Partition(arr, low, high)</span> → pivot = arr[high].price<br/>
                          Products with price &lt; pivot go left.<br/>
                          Products with price &gt; pivot go right.
                        </div>
                      </div>

                      <div className="w-full h-px bg-white/10"></div>

                      {/* Merge Sort Detail */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="flex items-center gap-3">
                          <GitMerge className="text-purple-500" size={24} />
                          <h4 className="text-xl font-bold text-foreground">Merge Sort (Ratings)</h4>
                        </div>
                        <p className="text-base text-muted-foreground leading-relaxed">
                          Merge Sort is ideal for sorting Ratings because it is a <strong>stable sort</strong>, meaning products with the same exact rating will stay in their original relative order. It uses a divide-and-conquer strategy to split the catalog down to single items, then merges them back together in perfect sorted order.
                        </p>
                        <div className="bg-background rounded-lg border border-border font-mono text-sm text-muted-foreground" style={{ padding: '20px', lineHeight: '1.8' }}>
                          <span className="text-purple-600 font-bold">Merge(leftHalf, rightHalf)</span><br/>
                          Compare left[i].rating with right[j].rating<br/>
                          Push highest rating to sorted array.
                        </div>
                      </div>

                      <div className="w-full h-px bg-border"></div>

                      {/* Heap Sort Detail */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="flex items-center gap-3">
                          <Network className="text-orange-500" size={24} />
                          <h4 className="text-xl font-bold text-foreground">Heap Sort (Discounts)</h4>
                        </div>
                        <p className="text-base text-muted-foreground leading-relaxed">
                          Heap Sort is extremely memory-efficient, making it perfect for finding the highest Discounts without requiring extra arrays. It builds a <strong>Max-Heap</strong> data structure (a binary tree where parent nodes are strictly larger than their children) out of the products' discount percentages, then repeatedly extracts the root (the highest discount).
                        </p>
                        <div className="bg-background rounded-lg border border-border font-mono text-sm text-muted-foreground" style={{ padding: '20px', lineHeight: '1.8' }}>
                          <span className="text-orange-600 font-bold">Heapify(arr, N, i)</span><br/>
                          largest = i (root)<br/>
                          if leftChild.discount &gt; root.discount → largest = leftChild<br/>
                          swap(root, largest)
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col" style={{ gap: '32px' }}>
            {/* Greedy Offers */}
            <div 
              className="rounded-2xl bg-gradient-to-br from-[#ff3f6c] to-[#e0365d] text-white shadow-lg relative overflow-hidden flex flex-col"
              style={{ padding: '36px' }}
            >
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center relative z-10 backdrop-blur-sm" style={{ marginBottom: '24px' }}>
                <Zap size={28} className="text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold relative z-10 tracking-tight" style={{ color: '#ffffff', marginBottom: '16px' }}>Greedy Offers</h3>
              <p className="text-white/95 text-base font-medium leading-relaxed relative z-10">
                Add items to your cart to see the Greedy Algorithm automatically apply the best coupon combination.
              </p>
              <div className="absolute -bottom-6 -right-6 opacity-10 pointer-events-none transform rotate-12">
                <Zap size={160} />
              </div>
            </div>

            {/* DP Recommendations */}
            <div 
              className="flex-1 rounded-2xl bg-surface border border-border shadow-sm flex flex-col"
              style={{ padding: '36px' }}
            >
              <div className="w-14 h-14 bg-blue-50/10 text-blue-600 rounded-full flex items-center justify-center" style={{ marginBottom: '24px' }}>
                <TrendingUp size={28} />
              </div>
              <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground" style={{ marginBottom: '16px' }}>
                DP Recommendations
              </h3>
              <p className="text-muted-foreground text-base font-medium leading-relaxed" style={{ marginBottom: '32px' }}>
                Visit any Product Detail page to see Dynamic Programming at work. It uses a variation of the Longest Common Subsequence concept to score products based on tag overlaps and feature similarity.
              </p>
              
              <div className="mt-auto bg-surface-hover rounded-xl border border-border" style={{ padding: '24px' }}>
                <p className="font-bold text-foreground text-base" style={{ marginBottom: '16px' }}>Scoring Matrix:</p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} className="text-base font-medium text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ff3f6c', flexShrink: 0 }}></span> 
                    Category Match: <span className="ml-auto font-bold text-foreground">+5 pts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#a855f7', flexShrink: 0 }}></span> 
                    Brand Match: <span className="ml-auto font-bold text-foreground">+4 pts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f97316', flexShrink: 0 }}></span> 
                    Price Proximity: <span className="ml-auto font-bold text-foreground">+1 to +3 pts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e', flexShrink: 0 }}></span> 
                    Tag Overlap: <span className="ml-auto font-bold text-foreground">+2 pts / tag</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Algorithm Chatbot */}
      <AlgorithmChatbot />
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Play, RotateCcw, ArrowRight } from 'lucide-react';

// ── Sample data for demos ──
const sampleProducts = [
  { id: 1, title: 'Denim Jacket', price: 2499, rating: 4.5, discount: 30 },
  { id: 2, title: 'Cotton Shirt', price: 899, rating: 4.2, discount: 15 },
  { id: 3, title: 'Slim Jeans', price: 1599, rating: 4.8, discount: 25 },
  { id: 4, title: 'Sneakers', price: 3299, rating: 4.1, discount: 40 },
  { id: 5, title: 'Hoodie', price: 1899, rating: 4.6, discount: 20 },
];

// ── Algorithm step generators ──
function generateQuickSortSteps(arr) {
  const steps = [];
  const data = arr.map(p => ({ ...p }));
  steps.push({
    title: 'Initial Array',
    description: `We start with ${data.length} products sorted randomly by price.`,
    array: data.map(p => p.price),
    labels: data.map(p => p.title),
    highlight: [],
    pivot: -1,
  });

  function qs(items, depth = 0) {
    if (items.length <= 1) return items;
    const pivot = items[items.length - 1];
    const left = [];
    const right = [];

    steps.push({
      title: `Step: Pick Pivot`,
      description: `Pivot chosen: ₹${pivot.price} (${pivot.title}). Now partition items into LEFT (< pivot) and RIGHT (> pivot).`,
      array: items.map(p => p.price),
      labels: items.map(p => p.title),
      highlight: [],
      pivot: items.length - 1,
    });

    for (let i = 0; i < items.length - 1; i++) {
      if (items[i].price < pivot.price) {
        left.push(items[i]);
      } else {
        right.push(items[i]);
      }
    }

    steps.push({
      title: `Partition Result`,
      description: `LEFT: [${left.map(p => '₹' + p.price).join(', ') || 'empty'}] | PIVOT: ₹${pivot.price} | RIGHT: [${right.map(p => '₹' + p.price).join(', ') || 'empty'}]`,
      array: [...left.map(p => p.price), pivot.price, ...right.map(p => p.price)],
      labels: [...left.map(p => p.title), pivot.title, ...right.map(p => p.title)],
      highlight: [left.length],
      pivot: left.length,
    });

    const sortedLeft = qs(left, depth + 1);
    const sortedRight = qs(right, depth + 1);
    return [...sortedLeft, pivot, ...sortedRight];
  }

  const sorted = qs(data);
  steps.push({
    title: '✅ Sorted!',
    description: `All products are now sorted by price: ${sorted.map(p => '₹' + p.price).join(' → ')}`,
    array: sorted.map(p => p.price),
    labels: sorted.map(p => p.title),
    highlight: sorted.map((_, i) => i),
    pivot: -1,
  });

  return steps;
}

function generateMergeSortSteps(arr) {
  const steps = [];
  const data = arr.map(p => ({ ...p }));

  steps.push({
    title: 'Initial Array',
    description: `We start with ${data.length} products. We will sort them by rating (highest first).`,
    array: data.map(p => p.rating),
    labels: data.map(p => p.title),
    highlight: [],
  });

  function ms(items, depth = 0) {
    if (items.length <= 1) return items;
    const mid = Math.floor(items.length / 2);
    const left = items.slice(0, mid);
    const right = items.slice(mid);

    steps.push({
      title: `Divide (Depth ${depth})`,
      description: `Split into LEFT [${left.map(p => p.rating).join(', ')}] and RIGHT [${right.map(p => p.rating).join(', ')}]`,
      array: [...left.map(p => p.rating), ...right.map(p => p.rating)],
      labels: [...left.map(p => p.title), ...right.map(p => p.title)],
      highlight: [mid - 1, mid],
    });

    const sortedLeft = ms(left, depth + 1);
    const sortedRight = ms(right, depth + 1);

    // Merge
    let result = [];
    let i = 0, j = 0;
    while (i < sortedLeft.length && j < sortedRight.length) {
      if (sortedLeft[i].rating >= sortedRight[j].rating) {
        result.push(sortedLeft[i++]);
      } else {
        result.push(sortedRight[j++]);
      }
    }
    result = result.concat(sortedLeft.slice(i)).concat(sortedRight.slice(j));

    steps.push({
      title: `Merge (Depth ${depth})`,
      description: `Merged result: [${result.map(p => p.rating).join(', ')}]`,
      array: result.map(p => p.rating),
      labels: result.map(p => p.title),
      highlight: result.map((_, idx) => idx),
    });

    return result;
  }

  const sorted = ms(data);
  steps.push({
    title: '✅ Sorted!',
    description: `Products sorted by rating: ${sorted.map(p => '⭐' + p.rating).join(' → ')}`,
    array: sorted.map(p => p.rating),
    labels: sorted.map(p => p.title),
    highlight: sorted.map((_, i) => i),
  });

  return steps;
}

function generateHeapSortSteps(arr) {
  const steps = [];
  const data = arr.map(p => ({ ...p }));

  steps.push({
    title: 'Initial Array',
    description: `We start with ${data.length} products. Goal: sort by discount % (highest first).`,
    array: data.map(p => p.discount),
    labels: data.map(p => p.title),
    highlight: [],
  });

  const heap = [...data];
  const n = heap.length;

  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapifyDemo(heap, n, i, steps);
  }

  steps.push({
    title: 'Max-Heap Built',
    description: `Heap root (max discount): ${heap[0].discount}% (${heap[0].title}). Now extract elements one by one.`,
    array: heap.map(p => p.discount),
    labels: heap.map(p => p.title),
    highlight: [0],
  });

  // Extract
  for (let i = n - 1; i > 0; i--) {
    steps.push({
      title: `Extract Max: ${heap[0].discount}%`,
      description: `Swap root (${heap[0].title}: ${heap[0].discount}%) with last unsorted (${heap[i].title}: ${heap[i].discount}%). Then heapify remaining.`,
      array: heap.map(p => p.discount),
      labels: heap.map(p => p.title),
      highlight: [0, i],
    });

    [heap[0], heap[i]] = [heap[i], heap[0]];
    heapifyDemo(heap, i, 0, steps);
  }

  steps.push({
    title: '✅ Sorted!',
    description: `Products sorted by discount: ${heap.map(p => p.discount + '%').join(' → ')}`,
    array: heap.map(p => p.discount),
    labels: heap.map(p => p.title),
    highlight: heap.map((_, i) => i),
  });

  return steps;
}

function heapifyDemo(arr, n, i, steps) {
  let largest = i;
  const l = 2 * i + 1;
  const r = 2 * i + 2;

  if (l < n && arr[l].discount > arr[largest].discount) largest = l;
  if (r < n && arr[r].discount > arr[largest].discount) largest = r;

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapifyDemo(arr, n, largest, steps);
  }
}

// ── Topic definitions ──
const topics = [
  {
    id: 'quick',
    label: '⚡ Quick Sort',
    color: '#ff3f6c',
    greeting: "Great choice! Let me show you how **Quick Sort** works to sort products by price. I'll use 5 sample products and walk you through each step.",
    getSteps: () => generateQuickSortSteps(sampleProducts),
  },
  {
    id: 'merge',
    label: '🧬 Merge Sort',
    color: '#a855f7',
    greeting: "Excellent! Let's explore **Merge Sort** — the stable divide-and-conquer algorithm we use for sorting by ratings. Watch how it splits and merges!",
    getSteps: () => generateMergeSortSteps(sampleProducts),
  },
  {
    id: 'heap',
    label: '⛰️ Heap Sort',
    color: '#f97316',
    greeting: "Let's dive into **Heap Sort**! We use it for sorting by discount percentage. It builds a Max-Heap and extracts the largest element repeatedly.",
    getSteps: () => generateHeapSortSteps(sampleProducts),
  },
  {
    id: 'binary',
    label: '🔍 Binary Search',
    color: '#3b82f6',
    greeting: "**Binary Search** is how we power the ultra-fast search overlay! Instead of checking every product one by one, we cut the search space in half each time.\n\n**How it works:**\n1. Pre-sort all products alphabetically by title\n2. Pick the middle product\n3. If your search query comes before it alphabetically, discard the right half\n4. If it comes after, discard the left half\n5. Repeat until found!\n\n**Result:** O(log N) — searching 1000 products takes only ~10 comparisons instead of 1000! 🚀",
    getSteps: null,
  },
  {
    id: 'greedy',
    label: '💰 Greedy Algorithm',
    color: '#10b981',
    greeting: "The **Greedy Algorithm** powers our Smart Coupon Optimizer in the cart!\n\n**How it works:**\n1. Collect all available coupon codes\n2. Sort them by potential discount value (highest first)\n3. Check each coupon: Does the cart total meet the minimum purchase requirement?\n4. The first valid coupon with the highest effective discount wins!\n\n**Why Greedy?** It always picks the locally optimal choice (highest discount) which, in this case, is also globally optimal since coupons don't stack. This runs in O(M log M) where M = number of offers.",
    getSteps: null,
  },
  {
    id: 'dp',
    label: '🧠 DP Recommendations',
    color: '#6366f1',
    greeting: "**Dynamic Programming** drives our product recommendations!\n\n**Scoring Matrix:**\n• Same category → +5 pts\n• Same subcategory → +3 pts\n• Same brand → +4 pts\n• Price within ₹500 → +3 pts\n• Price within ₹1000 → +1 pt\n• Each shared tag → +2 pts\n\n**How it works:**\n1. When you view a product, we build a DP score table for ALL other products\n2. Each product gets a similarity score based on the matrix above\n3. Products are sorted by score (highest first)\n4. Top results become your \"You might also like\" recommendations!\n\nTime: O(H × P) where H = features, P = products",
    getSteps: null,
  },
  {
    id: 'knapsack',
    label: '🎒 0/1 Knapsack',
    color: '#ec4899',
    greeting: "The **0/1 Knapsack Algorithm** powers the Budget Optimizer above!\n\n**Problem:** Given a budget (capacity) and products with prices (weights) and utility scores (values), find the combination that maximizes total value without exceeding the budget.\n\n**How it works:**\n1. Create a DP table: dp[w] = max value achievable with budget w\n2. For each product, decide: Include it or skip it?\n3. If including it gives more value → include it\n4. Track which items were chosen at each budget level\n5. dp[budget] contains the optimal answer!\n\n**Value formula:** (rating × 10) + discount%\n**Time:** O(N × W) where N = products, W = budget",
    getSteps: null,
  },
];

// ── Chatbot Component ──
export default function AlgorithmChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! 👋 I'm **LogicBot**, your algorithm assistant. Pick a topic below to see a live demo of how it works on real product data!",
      type: 'text',
    },
  ]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [demoSteps, setDemoSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const messagesEndRef = useRef(null);
  const playIntervalRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStep]);

  useEffect(() => {
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, []);

  const handleTopicSelect = (topic) => {
    setActiveTopic(topic);
    setCurrentStep(0);
    setIsPlaying(false);
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);

    const greeting = { role: 'bot', text: "Hi! 👋 I'm **LogicBot**, your algorithm assistant. Pick a topic below to see a live demo of how it works on real product data!", type: 'text' };
    const userMsg = { role: 'user', text: `Show me how ${topic.label.replace(/[⚡🧬⛰️🔍💰🧠🎒]\s?/, '')} works`, type: 'text' };
    const botMsg = { role: 'bot', text: topic.greeting, type: 'text' };

    if (topic.getSteps) {
      const steps = topic.getSteps();
      setDemoSteps(steps);
      setMessages([greeting, userMsg, botMsg, { role: 'bot', type: 'demo', topicId: topic.id }]);
    } else {
      setDemoSteps([]);
      setMessages([greeting, userMsg, botMsg]);
    }
  };

  const handlePlayDemo = () => {
    if (isPlaying) {
      clearInterval(playIntervalRef.current);
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    playIntervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= demoSteps.length - 1) {
          clearInterval(playIntervalRef.current);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
  };

  const step = demoSteps[currentStep];
  const maxVal = step ? Math.max(...step.array) : 1;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white"
            style={{ backgroundColor: '#ff3f6c' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 z-50 overflow-hidden flex flex-col border-l border-neutral-200 shadow-2xl"
            style={{
              width: '50vw',
              maxWidth: '700px',
              minWidth: '420px',
              height: '100vh',
              backgroundColor: '#ffffff',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #ff3f6c 0%, #e0365d 100%)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-base" style={{ color: '#ffffff' }}>LogicBot</h3>
                  <p className="text-xs text-white/80">Algorithm Demo Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ backgroundColor: '#f8f9fa' }}>
              {messages.map((msg, i) => (
                <div key={i}>
                  {msg.type === 'text' && (
                    <div className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'bot' && (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: '#ff3f6c' }}>
                          <Bot size={16} className="text-white" />
                        </div>
                      )}
                      <div
                        className="max-w-[80%] px-5 py-4 rounded-2xl text-sm leading-relaxed"
                        style={msg.role === 'user'
                          ? { backgroundColor: '#ff3f6c', color: '#ffffff', borderBottomRightRadius: '4px' }
                          : { backgroundColor: '#ffffff', color: '#1a1a2e', border: '1px solid #e5e7eb', borderBottomLeftRadius: '4px' }
                        }
                      >
                        {msg.text.split('\n').map((line, j) => (
                          <span key={j}>
                            {line.split(/(\*\*.*?\*\*)/g).map((part, k) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={k}>{part.slice(2, -2)}</strong>;
                              }
                              return part;
                            })}
                            {j < msg.text.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 mt-0.5">
                          <User size={16} className="text-neutral-600" />
                        </div>
                      )}
                    </div>
                  )}

                  {msg.type === 'demo' && step && (
                    <div style={{ marginTop: '16px' }}>
                      {/* Demo Visualization */}
                      <div className="rounded-xl overflow-hidden border border-neutral-200" style={{ backgroundColor: '#1a1d2e' }}>
                        <div style={{ padding: '16px 24px' }} className="border-b border-white/10 flex items-center justify-between">
                          <span className="text-base font-bold" style={{ color: '#ffffff' }}>
                            {step.title}
                          </span>
                          <span className="text-xs font-mono text-neutral-400">
                            Step {currentStep + 1}/{demoSteps.length}
                          </span>
                        </div>

                        {/* Bar Chart */}
                        <div className="flex items-end justify-center" style={{ padding: '32px 24px', minHeight: '220px', gap: '16px' }}>
                          {step.array.map((val, idx) => (
                            <div key={idx} className="flex flex-col items-center" style={{ flex: '1 1 0', gap: '8px' }}>
                              <span className="text-sm font-mono font-bold" style={{ color: step.highlight?.includes(idx) ? '#4ade80' : (step.pivot === idx ? '#ff3f6c' : '#94a3b8') }}>
                                {val}
                              </span>
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(val / maxVal) * 120}px` }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                className="w-full rounded-t"
                                style={{
                                  minWidth: '36px',
                                  backgroundColor: step.pivot === idx
                                    ? '#ff3f6c'
                                    : step.highlight?.includes(idx)
                                      ? '#4ade80'
                                      : '#475569',
                                }}
                              />
                              <span className="text-xs text-neutral-400 truncate max-w-full text-center font-medium">
                                {step.labels?.[idx]?.split(' ')[0]}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Description */}
                        <div className="border-t border-white/10" style={{ padding: '16px 24px' }}>
                          <p className="text-sm text-neutral-300 leading-relaxed">{step.description}</p>
                        </div>

                        {/* Controls */}
                        <div className="border-t border-white/10 flex items-center" style={{ padding: '16px 24px', gap: '12px' }}>
                          <button
                            onClick={handlePlayDemo}
                            className="flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 text-white transition-colors"
                            style={{ backgroundColor: isPlaying ? '#ef4444' : '#ff3f6c' }}
                          >
                            <Play size={14} /> {isPlaying ? 'Pause' : 'Auto Play'}
                          </button>
                          <button
                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                            disabled={currentStep === 0}
                            className="px-4 py-3 rounded-lg text-sm font-bold bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
                          >
                            ←
                          </button>
                          <button
                            onClick={() => setCurrentStep(Math.min(demoSteps.length - 1, currentStep + 1))}
                            disabled={currentStep >= demoSteps.length - 1}
                            className="px-4 py-3 rounded-lg text-sm font-bold bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
                          >
                            →
                          </button>
                          <button
                            onClick={handleReset}
                            className="px-4 py-3 rounded-lg text-sm font-bold bg-white/10 text-white hover:bg-white/20 transition-colors"
                          >
                            <RotateCcw size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Topic Selector */}
            <div className="shrink-0 border-t border-neutral-200 bg-white" style={{ padding: '20px 24px' }}>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Pick an Algorithm</p>
              <div className="flex flex-wrap gap-2.5">
                {topics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicSelect(topic)}
                    className="px-4 py-2 rounded-full text-xs font-bold transition-all border"
                    style={{
                      backgroundColor: activeTopic?.id === topic.id ? topic.color : 'transparent',
                      color: activeTopic?.id === topic.id ? '#ffffff' : topic.color,
                      borderColor: topic.color,
                    }}
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

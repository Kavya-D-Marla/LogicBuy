import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  function getTimeLeft(target) {
    const diff = new Date(target) - new Date();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  const pad = (n) => String(n).padStart(2, '0');

  const units = [
    { label: 'HRS', value: pad(timeLeft.hours) },
    { label: 'MIN', value: pad(timeLeft.minutes) },
    { label: 'SEC', value: pad(timeLeft.seconds) },
  ];

  return (
    <div className="flex items-center gap-2">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-2">
          <div className="countdown-digit">
            <div className="countdown-card flex flex-col items-center justify-center w-14 h-16 sm:w-16 sm:h-18">
              <span className="text-xl sm:text-2xl leading-none">{unit.value}</span>
              <span className="text-[9px] tracking-widest text-neutral-400 mt-1">{unit.label}</span>
            </div>
          </div>
          {i < units.length - 1 && <span className="text-xl font-bold text-pink">:</span>}
        </div>
      ))}
    </div>
  );
}

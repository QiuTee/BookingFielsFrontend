export function groupTimeRanges(times) {
    const toMinutes = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const toString = (m) => {
      const h = Math.floor(m / 60);
      const mm = m % 60;
      return `${h.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
    };
  
    const sorted = [...new Set(times.map(toMinutes))].sort((a, b) => a - b);
    const groups = [];
  
    let start = sorted[0];
    let prev = sorted[0];
  
    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      if (current - prev === 30) {
        prev = current;
      } else {
        groups.push([start, prev]);
        start = prev = current;
      }
    }
  
    groups.push([start, prev]);
  
    return groups.map(([s, e]) =>
      s === e ? toString(s) : `${toString(s)} - ${toString(e + 30)}`
    );
  }
  
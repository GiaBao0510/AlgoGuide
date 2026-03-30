/* greedy.js — Greedy Algorithms */
(function(){
const R = window.AlgoRegistry || (window.AlgoRegistry = {});

function greedyRender(canvas, step) {
  renderArrayBars(canvas, step.array, step.highlights);
}

R['activity-selection'] = {
  name: 'Activity Selection',
  group: 'greedy',
  defaultInput: '1-4, 3-5, 0-6, 5-7, 3-9, 5-9, 6-10, 8-11, 8-12, 2-14, 12-16',
  description: 'Chọn nhiều hoạt động nhất không chồng lấp bằng chiến lược tham lam: luôn chọn hoạt động kết thúc sớm nhất tiếp theo.',
  complexity: { timeBest: 'O(n log n)', timeAvg: 'O(n log n)', timeWorst: 'O(n log n)', space: 'O(n)' },
  pros: ['Dễ cài đặt', 'Tối ưu cho bài toán kinh điển', 'Trực quan'],
  cons: ['Chỉ đúng cho lớp bài toán phù hợp greedy'],
  useCases: ['Lập lịch phòng họp', 'Scheduling đơn giản'],
  visualize(raw) {
    const acts = (raw || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => {
        const parts = s.split('-').map(x => parseInt(x.trim(), 10));
        return { start: parts[0], end: parts[1] };
      })
      .filter(a => Number.isFinite(a.start) && Number.isFinite(a.end) && a.start < a.end)
      .sort((a, b) => a.end - b.end);

    const steps = [];
    if (!acts.length) {
      return [{ array: [0], highlights: {}, description: 'Input không hợp lệ. Dùng định dạng: 1-4, 3-5, 5-7' }];
    }

    let lastEnd = -Infinity;
    const selected = [];
    steps.push({
      array: acts.map(a => a.end - a.start),
      highlights: {},
      description: 'Sắp xếp theo thời điểm kết thúc tăng dần'
    });

    acts.forEach((a, idx) => {
      if (a.start >= lastEnd) {
        selected.push(idx);
        lastEnd = a.end;
        steps.push({
          array: acts.map(x => x.end - x.start),
          highlights: { found: [...selected] },
          description: `Chọn hoạt động (${a.start}-${a.end})`
        });
      } else {
        steps.push({
          array: acts.map(x => x.end - x.start),
          highlights: { comparing: [idx], found: [...selected] },
          description: `Bỏ hoạt động (${a.start}-${a.end}) do chồng lấp`
        });
      }
    });

    steps.push({
      array: acts.map(x => x.end - x.start),
      highlights: { found: [...selected] },
      description: `Kết quả: chọn được ${selected.length} hoạt động`
    });

    return steps;
  },
  render: greedyRender,
  code: {
    javascript: `function activitySelection(activities) {
  activities.sort((a, b) => a.end - b.end);
  const selected = [];
  let lastEnd = -Infinity;
  for (const act of activities) {
    if (act.start >= lastEnd) {
      selected.push(act);
      lastEnd = act.end;
    }
  }
  return selected;
}`,
    go: `func activitySelection(acts []Activity) []Activity {
    sort.Slice(acts, func(i, j int) bool { return acts[i].End < acts[j].End })
    selected := []Activity{}
    lastEnd := math.MinInt
    for _, a := range acts {
        if a.Start >= lastEnd {
            selected = append(selected, a)
            lastEnd = a.End
        }
    }
    return selected
}`,
    csharp: `public static List<Activity> ActivitySelection(List<Activity> acts) {
    acts.Sort((a, b) => a.End.CompareTo(b.End));
    var selected = new List<Activity>();
    int lastEnd = int.MinValue;
    foreach (var a in acts) {
        if (a.Start >= lastEnd) {
            selected.Add(a);
            lastEnd = a.End;
        }
    }
    return selected;
}`
  }
};

R['coin-change-greedy'] = {
  name: 'Coin Change (Greedy)',
  group: 'greedy',
  defaultInput: '63 | 1, 5, 10, 25',
  description: 'Dùng đồng tiền mệnh giá lớn nhất có thể ở mỗi bước để giảm số lượng đồng. Hiệu quả với hệ tiền chuẩn.',
  complexity: { timeBest: 'O(k log k)', timeAvg: 'O(k log k)', timeWorst: 'O(k log k)', space: 'O(k)' },
  pros: ['Nhanh', 'Dễ hiểu'],
  cons: ['Không luôn tối ưu với mọi bộ mệnh giá'],
  useCases: ['Cash register', 'Bài toán đổi tiền chuẩn'],
  visualize(raw) {
    const parts = (raw || '').split('|');
    const amount = parseInt((parts[0] || '0').trim(), 10);
    const coins = parseArrayInput(parts[1] || '1,5,10,25').filter(n => n > 0).sort((a, b) => b - a);

    const steps = [];
    if (!Number.isFinite(amount) || amount < 0 || !coins.length) {
      return [{ array: [0], highlights: {}, description: 'Input không hợp lệ. Dùng: 63 | 1,5,10,25' }];
    }

    let remain = amount;
    const used = [];
    steps.push({ array: coins, highlights: {}, description: `Đổi số tiền ${amount}` });

    coins.forEach((coin, idx) => {
      let count = 0;
      while (remain >= coin) {
        remain -= coin;
        count++;
        used.push(coin);
      }
      steps.push({
        array: coins,
        highlights: { active: [idx] },
        description: `Dùng ${count} đồng ${coin}, còn lại ${remain}`
      });
    });

    steps.push({
      array: coins,
      highlights: { sorted: Array.from({ length: coins.length }, (_, i) => i) },
      description: `Kết quả: ${used.length} đồng (${used.join(', ') || 'không dùng đồng nào'})`
    });
    return steps;
  },
  render: greedyRender,
  code: {
    javascript: `function coinChangeGreedy(amount, coins) {
  coins.sort((a, b) => b - a);
  const used = [];
  for (const c of coins) {
    while (amount >= c) {
      amount -= c;
      used.push(c);
    }
  }
  return amount === 0 ? used : null;
}`,
    go: `func coinChangeGreedy(amount int, coins []int) []int {
    sort.Sort(sort.Reverse(sort.IntSlice(coins)))
    used := []int{}
    for _, c := range coins {
        for amount >= c {
            amount -= c
            used = append(used, c)
        }
    }
    if amount != 0 { return nil }
    return used
}`,
    csharp: `public static List<int>? CoinChangeGreedy(int amount, List<int> coins) {
    coins.Sort((a, b) => b.CompareTo(a));
    var used = new List<int>();
    foreach (var c in coins) {
        while (amount >= c) {
            amount -= c;
            used.Add(c);
        }
    }
    return amount == 0 ? used : null;
}`
  }
};

})();
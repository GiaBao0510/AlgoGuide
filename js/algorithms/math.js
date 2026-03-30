/* math.js — Math Algorithms */
(function(){
const R = window.AlgoRegistry || (window.AlgoRegistry = {});

function mathRender(canvas, step) {
  renderArrayBars(canvas, step.array, step.highlights);
}

R['euclid-gcd'] = {
  name: 'Euclid GCD',
  group: 'math',
  defaultInput: '252, 105',
  description: 'Thuật toán Euclid tìm ước chung lớn nhất bằng phép chia dư lặp: gcd(a, b) = gcd(b, a mod b).',
  complexity: { timeBest: 'O(log min(a,b))', timeAvg: 'O(log min(a,b))', timeWorst: 'O(log min(a,b))', space: 'O(1)' },
  pros: ['Rất nhanh', 'Ngắn gọn', 'Nền tảng cho số học mô-đun'],
  cons: ['Chỉ áp dụng cho số nguyên'],
  useCases: ['Rút gọn phân số', 'Cryptography'],
  visualize(raw) {
    const nums = parseArrayInput(raw || '252,105');
    let a = Math.abs(nums[0] || 252);
    let b = Math.abs(nums[1] || 105);
    const steps = [];

    steps.push({ array: [a, b], highlights: { active: [0, 1] }, description: `Bắt đầu với a=${a}, b=${b}` });
    while (b !== 0) {
      const r = a % b;
      steps.push({
        array: [a, b, r],
        highlights: { active: [0, 1], found: [2] },
        description: `${a} mod ${b} = ${r}`
      });
      a = b;
      b = r;
    }
    steps.push({ array: [a], highlights: { found: [0] }, description: `GCD = ${a}` });
    return steps;
  },
  render: mathRender,
  code: {
    javascript: `function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b !== 0) {
    const r = a % b;
    a = b;
    b = r;
  }
  return a;
}`,
    go: `func gcd(a, b int) int {
    if a < 0 { a = -a }
    if b < 0 { b = -b }
    for b != 0 {
        a, b = b, a%b
    }
    return a
}`,
    csharp: `public static int Gcd(int a, int b) {
    a = Math.Abs(a); b = Math.Abs(b);
    while (b != 0) {
        int r = a % b;
        a = b;
        b = r;
    }
    return a;
}`
  }
};

R['sieve-of-eratosthenes'] = {
  name: 'Sieve of Eratosthenes',
  group: 'math',
  defaultInput: '50',
  description: 'Liệt kê số nguyên tố đến N bằng cách đánh dấu bội số của từng số nguyên tố bắt đầu từ 2.',
  complexity: { timeBest: 'O(n log log n)', timeAvg: 'O(n log log n)', timeWorst: 'O(n log log n)', space: 'O(n)' },
  pros: ['Nhanh cho nhiều truy vấn prime', 'Dễ cài đặt'],
  cons: ['Cần bộ nhớ O(n)'],
  useCases: ['Prime table', 'Number theory'],
  visualize(raw) {
    const n = Math.max(2, parseInt((raw || '50').trim(), 10) || 50);
    const prime = new Array(n + 1).fill(true);
    prime[0] = false;
    prime[1] = false;
    const steps = [];

    steps.push({ array: Array.from({ length: n - 1 }, (_, i) => i + 2), highlights: {}, description: `Khởi tạo sàng đến ${n}` });

    for (let p = 2; p * p <= n; p++) {
      if (!prime[p]) continue;
      steps.push({
        array: Array.from({ length: n - 1 }, (_, i) => i + 2),
        highlights: { active: [p - 2] },
        description: `Giữ ${p} là nguyên tố, đánh dấu các bội số`
      });
      for (let m = p * p; m <= n; m += p) {
        prime[m] = false;
      }
      const found = [];
      for (let i = 2; i <= n; i++) {
        if (prime[i]) found.push(i - 2);
      }
      steps.push({
        array: Array.from({ length: n - 1 }, (_, i) => i + 2),
        highlights: { found },
        description: `Sau khi xử lý p=${p}`
      });
    }

    const found = [];
    for (let i = 2; i <= n; i++) {
      if (prime[i]) found.push(i - 2);
    }
    steps.push({
      array: Array.from({ length: n - 1 }, (_, i) => i + 2),
      highlights: { found },
      description: `Có ${found.length} số nguyên tố <= ${n}`
    });

    return steps;
  },
  render: mathRender,
  code: {
    javascript: `function sieve(n) {
  const prime = new Array(n + 1).fill(true);
  prime[0] = prime[1] = false;
  for (let p = 2; p * p <= n; p++) {
    if (!prime[p]) continue;
    for (let m = p * p; m <= n; m += p) {
      prime[m] = false;
    }
  }
  const result = [];
  for (let i = 2; i <= n; i++) if (prime[i]) result.push(i);
  return result;
}`,
    go: `func sieve(n int) []int {
    prime := make([]bool, n+1)
    for i := range prime { prime[i] = true }
    if n >= 0 { prime[0] = false }
    if n >= 1 { prime[1] = false }
    for p := 2; p*p <= n; p++ {
        if !prime[p] { continue }
        for m := p * p; m <= n; m += p {
            prime[m] = false
        }
    }
    out := []int{}
    for i := 2; i <= n; i++ {
        if prime[i] { out = append(out, i) }
    }
    return out
}`,
    csharp: `public static List<int> Sieve(int n) {
    var prime = Enumerable.Repeat(true, n + 1).ToArray();
    if (n >= 0) prime[0] = false;
    if (n >= 1) prime[1] = false;
    for (int p = 2; p * p <= n; p++) {
        if (!prime[p]) continue;
        for (int m = p * p; m <= n; m += p) {
            prime[m] = false;
        }
    }
    var result = new List<int>();
    for (int i = 2; i <= n; i++) if (prime[i]) result.Add(i);
    return result;
}`
  }
};

})();
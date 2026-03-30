/* ============================================
   searching.js — 6 Searching Algorithms
   ============================================ */
(function() {
  const R = window.AlgoRegistry;
  function searchRender(canvas, step) { renderArrayBars(canvas, step.array, step.highlights); }

  /* ===== 1. LINEAR SEARCH ===== */
  R['linear-search'] = {
    name: 'Linear Search', group: 'searching', defaultInput: '10, 23, 45, 70, 11, 15',
    description: 'Linear Search duyệt từng phần tử trong mảng từ đầu đến cuối để tìm giá trị mục tiêu. Đơn giản nhất nhưng chậm nhất. Hoạt động trên mảng không sắp xếp.',
    complexity: { timeBest: 'O(1)', timeAvg: 'O(n)', timeWorst: 'O(n)', space: 'O(1)' },
    pros: ['Đơn giản nhất', 'Không cần sắp xếp', 'Hoạt động trên mọi cấu trúc'],
    cons: ['Chậm O(n)', 'Không hiệu quả với dữ liệu lớn'],
    useCases: ['Dữ liệu nhỏ', 'Mảng không sắp xếp', 'Tìm kiếm lần đầu'],
    randomInput() { return generateRandomArray(12, 1, 99).join(', ') + ' | ' + Math.floor(Math.random()*99+1); },
    visualize(raw) {
      const parts = raw.split('|'); const arr = parseArrayInput(parts[0]);
      const target = parseInt((parts[1]||'').trim()) || arr[Math.floor(Math.random()*arr.length)];
      const steps = []; steps.push({ array: [...arr], highlights: {}, description: `Tìm giá trị ${target}` });
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
          steps.push({ array: [...arr], highlights: { found: [i] }, description: `✅ Tìm thấy ${target} tại vị trí ${i}` });
          return steps;
        }
        steps.push({ array: [...arr], highlights: { comparing: [i] }, description: `Kiểm tra a[${i}]=${arr[i]} ≠ ${target}` });
      }
      steps.push({ array: [...arr], highlights: {}, description: `❌ Không tìm thấy ${target}` });
      return steps;
    },
    render: searchRender,
    code: {
      javascript: `function linearSearch(arr, target) {
  // Duyệt từng phần tử
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i; // Tìm thấy
  }
  return -1; // Không tìm thấy
}`,
      go: `func linearSearch(arr []int, target int) int {
    // Duyệt từng phần tử
    for i, v := range arr {
        if v == target {
            return i // Tìm thấy
        }
    }
    return -1 // Không tìm thấy
}`,
      csharp: `public static int LinearSearch(int[] arr, int target) {
    // Duyệt từng phần tử
    for (int i = 0; i < arr.Length; i++) {
        if (arr[i] == target) return i; // Tìm thấy
    }
    return -1; // Không tìm thấy
}`
    }
  };

  /* ===== 2. BINARY SEARCH ===== */
  R['binary-search'] = {
    name: 'Binary Search', group: 'searching', defaultInput: '2, 5, 8, 12, 16, 23, 38, 56, 72, 91',
    description: 'Binary Search tìm kiếm trên mảng đã sắp xếp bằng cách chia đôi không gian tìm kiếm mỗi bước. So sánh target với phần tử giữa, nếu nhỏ hơn thì tìm nửa trái, lớn hơn thì tìm nửa phải. Rất hiệu quả O(log n).',
    complexity: { timeBest: 'O(1)', timeAvg: 'O(log n)', timeWorst: 'O(log n)', space: 'O(1)' },
    pros: ['Rất nhanh O(log n)', 'Đơn giản', 'Ít bộ nhớ'],
    cons: ['Cần mảng đã sắp xếp', 'Chỉ cho random access', 'Không tốt cho linked list'],
    useCases: ['Tìm kiếm trong mảng sắp xếp', 'Từ điển', 'Database index'],
    randomInput() { const a = generateRandomArray(12,1,99).sort((x,y)=>x-y); return a.join(', ') + ' | ' + a[Math.floor(Math.random()*a.length)]; },
    visualize(raw) {
      const parts = raw.split('|'); const arr = parseArrayInput(parts[0]).sort((a,b)=>a-b);
      const target = parseInt((parts[1]||'').trim()) || arr[Math.floor(Math.random()*arr.length)];
      const steps = []; let lo = 0, hi = arr.length - 1;
      steps.push({ array: [...arr], highlights: {}, description: `Tìm ${target} trong mảng đã sắp xếp` });
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        steps.push({ array: [...arr], highlights: { active: [mid], comparing: [lo, hi] }, description: `lo=${lo}, hi=${hi}, mid=${mid}: a[${mid}]=${arr[mid]}` });
        if (arr[mid] === target) {
          steps.push({ array: [...arr], highlights: { found: [mid] }, description: `✅ Tìm thấy ${target} tại vị trí ${mid}` });
          return steps;
        } else if (arr[mid] < target) {
          lo = mid + 1;
          steps.push({ array: [...arr], highlights: { active: [mid] }, description: `${arr[mid]} < ${target}, tìm nửa phải` });
        } else {
          hi = mid - 1;
          steps.push({ array: [...arr], highlights: { active: [mid] }, description: `${arr[mid]} > ${target}, tìm nửa trái` });
        }
      }
      steps.push({ array: [...arr], highlights: {}, description: `❌ Không tìm thấy ${target}` });
      return steps;
    },
    render: searchRender,
    code: {
      javascript: `function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;      // Tìm thấy
    else if (arr[mid] < target) lo = mid + 1; // Tìm nửa phải
    else hi = mid - 1;                        // Tìm nửa trái
  }
  return -1;
}`,
      go: `func binarySearch(arr []int, target int) int {
    lo, hi := 0, len(arr)-1
    for lo <= hi {
        mid := (lo + hi) / 2
        if arr[mid] == target { return mid }
        if arr[mid] < target { lo = mid + 1 } else { hi = mid - 1 }
    }
    return -1
}`,
      csharp: `public static int BinarySearch(int[] arr, int target) {
    int lo = 0, hi = arr.Length - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`
    }
  };

  /* ===== 3. TERNARY SEARCH ===== */
  R['ternary-search'] = {
    name: 'Ternary Search', group: 'searching', defaultInput: '1, 4, 7, 10, 15, 20, 25, 30, 40, 50',
    description: 'Ternary Search chia không gian tìm kiếm thành 3 phần bằng nhau. So sánh target với 2 điểm chia mid1 và mid2. Mỗi bước loại bỏ 1/3 không gian, nhưng cần 2 phép so sánh nên thực tế chậm hơn Binary Search.',
    complexity: { timeBest: 'O(1)', timeAvg: 'O(log₃ n)', timeWorst: 'O(log₃ n)', space: 'O(1)' },
    pros: ['Chia 3 phần', 'Tốt cho tìm cực trị hàm unimodal'],
    cons: ['Chậm hơn Binary Search (2 so sánh/bước)', 'Cần mảng sắp xếp'],
    useCases: ['Tìm cực trị hàm unimodal', 'Optimization problems', 'Competitive programming'],
    randomInput() { const a = generateRandomArray(10,1,99).sort((x,y)=>x-y); return a.join(', ') + ' | ' + a[Math.floor(Math.random()*a.length)]; },
    visualize(raw) {
      const parts = raw.split('|'); const arr = parseArrayInput(parts[0]).sort((a,b)=>a-b);
      const target = parseInt((parts[1]||'').trim()) || arr[Math.floor(Math.random()*arr.length)];
      const steps = []; let lo = 0, hi = arr.length - 1;
      steps.push({ array: [...arr], highlights: {}, description: `Ternary Search: tìm ${target}` });
      while (lo <= hi) {
        const m1 = lo + Math.floor((hi-lo)/3), m2 = hi - Math.floor((hi-lo)/3);
        steps.push({ array: [...arr], highlights: { active: [m1, m2], comparing: [lo, hi] }, description: `m1=${m1}(${arr[m1]}), m2=${m2}(${arr[m2]})` });
        if (arr[m1] === target) { steps.push({ array: [...arr], highlights: { found: [m1] }, description: `✅ Tìm thấy tại ${m1}` }); return steps; }
        if (arr[m2] === target) { steps.push({ array: [...arr], highlights: { found: [m2] }, description: `✅ Tìm thấy tại ${m2}` }); return steps; }
        if (target < arr[m1]) hi = m1 - 1;
        else if (target > arr[m2]) lo = m2 + 1;
        else { lo = m1 + 1; hi = m2 - 1; }
      }
      steps.push({ array: [...arr], highlights: {}, description: `❌ Không tìm thấy ${target}` });
      return steps;
    },
    render: searchRender,
    code: {
      javascript: `function ternarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const m1 = lo + Math.floor((hi - lo) / 3);
    const m2 = hi - Math.floor((hi - lo) / 3);
    if (arr[m1] === target) return m1;
    if (arr[m2] === target) return m2;
    if (target < arr[m1]) hi = m1 - 1;       // Phần 1/3 trái
    else if (target > arr[m2]) lo = m2 + 1;   // Phần 1/3 phải
    else { lo = m1 + 1; hi = m2 - 1; }        // Phần giữa
  }
  return -1;
}`,
      go: `func ternarySearch(arr []int, target int) int {
    lo, hi := 0, len(arr)-1
    for lo <= hi {
        m1 := lo + (hi-lo)/3
        m2 := hi - (hi-lo)/3
        if arr[m1] == target { return m1 }
        if arr[m2] == target { return m2 }
        if target < arr[m1] { hi = m1 - 1 } else if target > arr[m2] { lo = m2 + 1 } else { lo = m1 + 1; hi = m2 - 1 }
    }
    return -1
}`,
      csharp: `public static int TernarySearch(int[] arr, int target) {
    int lo = 0, hi = arr.Length - 1;
    while (lo <= hi) {
        int m1 = lo + (hi - lo) / 3;
        int m2 = hi - (hi - lo) / 3;
        if (arr[m1] == target) return m1;
        if (arr[m2] == target) return m2;
        if (target < arr[m1]) hi = m1 - 1;
        else if (target > arr[m2]) lo = m2 + 1;
        else { lo = m1 + 1; hi = m2 - 1; }
    }
    return -1;
}`
    }
  };

  /* ===== 4. JUMP SEARCH ===== */
  R['jump-search'] = {
    name: 'Jump Search', group: 'searching', defaultInput: '1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25',
    description: 'Jump Search nhảy từng block có kích thước √n trong mảng đã sắp xếp. Khi tìm được block chứa target, thực hiện linear search trong block đó. Cân bằng giữa linear search và binary search.',
    complexity: { timeBest: 'O(1)', timeAvg: 'O(√n)', timeWorst: 'O(√n)', space: 'O(1)' },
    pros: ['Tốt hơn Linear Search', 'Đơn giản hơn Binary Search', 'Tốt cho dữ liệu trên đĩa'],
    cons: ['Cần mảng sắp xếp', 'Chậm hơn Binary Search', 'Kích thước jump cố định'],
    useCases: ['Hệ thống file', 'Khi binary search quá phức tạp', 'Truy cập tuần tự tốt hơn random'],
    randomInput() { const a = generateRandomArray(15,1,50).sort((x,y)=>x-y); return a.join(', ') + ' | ' + a[Math.floor(Math.random()*a.length)]; },
    visualize(raw) {
      const parts = raw.split('|'); const arr = parseArrayInput(parts[0]).sort((a,b)=>a-b);
      const target = parseInt((parts[1]||'').trim()) || arr[Math.floor(Math.random()*arr.length)];
      const steps = []; const n = arr.length; const jump = Math.floor(Math.sqrt(n));
      steps.push({ array: [...arr], highlights: {}, description: `Jump Search: tìm ${target}, step=${jump}` });
      let prev = 0, curr = 0;
      while (curr < n && arr[Math.min(curr, n-1)] < target) {
        steps.push({ array: [...arr], highlights: { active: [Math.min(curr, n-1)] }, description: `Nhảy tới index ${Math.min(curr, n-1)}: a=${arr[Math.min(curr, n-1)]}` });
        prev = curr; curr += jump;
      }
      for (let i = prev; i < Math.min(curr, n); i++) {
        steps.push({ array: [...arr], highlights: { comparing: [i] }, description: `Linear search: kiểm tra a[${i}]=${arr[i]}` });
        if (arr[i] === target) { steps.push({ array: [...arr], highlights: { found: [i] }, description: `✅ Tìm thấy ${target} tại ${i}` }); return steps; }
      }
      steps.push({ array: [...arr], highlights: {}, description: `❌ Không tìm thấy ${target}` });
      return steps;
    },
    render: searchRender,
    code: {
      javascript: `function jumpSearch(arr, target) {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n));
  let prev = 0;
  // Nhảy từng block
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  // Linear search trong block
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }
  return arr[prev] === target ? prev : -1;
}`,
      go: `func jumpSearch(arr []int, target int) int {
    n := len(arr)
    step := int(math.Sqrt(float64(n)))
    prev := 0
    for arr[min(step, n)-1] < target {
        prev = step
        step += int(math.Sqrt(float64(n)))
        if prev >= n { return -1 }
    }
    for arr[prev] < target {
        prev++
        if prev == min(step, n) { return -1 }
    }
    if arr[prev] == target { return prev }
    return -1
}`,
      csharp: `public static int JumpSearch(int[] arr, int target) {
    int n = arr.Length;
    int step = (int)Math.Sqrt(n), prev = 0;
    while (arr[Math.Min(step, n) - 1] < target) {
        prev = step;
        step += (int)Math.Sqrt(n);
        if (prev >= n) return -1;
    }
    while (arr[prev] < target) {
        prev++;
        if (prev == Math.Min(step, n)) return -1;
    }
    return arr[prev] == target ? prev : -1;
}`
    }
  };

  /* ===== 5. INTERPOLATION SEARCH ===== */
  R['interpolation-search'] = {
    name: 'Interpolation Search', group: 'searching', defaultInput: '10, 20, 30, 40, 50, 60, 70, 80, 90, 100',
    description: 'Interpolation Search ước tính vị trí target dựa trên phân bố giá trị, thay vì luôn chọn giữa như Binary Search. Hiệu quả O(log log n) khi dữ liệu phân bố đều, nhưng worst case O(n).',
    complexity: { timeBest: 'O(1)', timeAvg: 'O(log log n)', timeWorst: 'O(n)', space: 'O(1)' },
    pros: ['Rất nhanh khi dữ liệu phân bố đều', 'O(log log n) average', 'Trực quan'],
    cons: ['Worst case O(n)', 'Cần dữ liệu phân bố đều', 'Phức tạp hơn Binary Search'],
    useCases: ['Dữ liệu phân bố đều', 'Tìm kiếm trong from điện thoại', 'Khi biết phân bố dữ liệu'],
    randomInput() { const a = Array.from({length:10},(_,i)=>(i+1)*10); return a.join(', ') + ' | ' + a[Math.floor(Math.random()*a.length)]; },
    visualize(raw) {
      const parts = raw.split('|'); const arr = parseArrayInput(parts[0]).sort((a,b)=>a-b);
      const target = parseInt((parts[1]||'').trim()) || arr[Math.floor(Math.random()*arr.length)];
      const steps = []; let lo = 0, hi = arr.length - 1;
      steps.push({ array: [...arr], highlights: {}, description: `Interpolation Search: tìm ${target}` });
      while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
        const pos = lo + Math.floor(((target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo]));
        steps.push({ array: [...arr], highlights: { active: [pos], comparing: [lo, hi] }, description: `Ước tính vị trí: ${pos}, a[${pos}]=${arr[pos]}` });
        if (arr[pos] === target) { steps.push({ array: [...arr], highlights: { found: [pos] }, description: `✅ Tìm thấy ${target} tại ${pos}` }); return steps; }
        if (arr[pos] < target) lo = pos + 1; else hi = pos - 1;
      }
      steps.push({ array: [...arr], highlights: {}, description: `❌ Không tìm thấy ${target}` });
      return steps;
    },
    render: searchRender,
    code: {
      javascript: `function interpolationSearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
    // Ước tính vị trí dựa trên phân bố
    const pos = lo + Math.floor(
      ((target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo])
    );
    if (arr[pos] === target) return pos;
    if (arr[pos] < target) lo = pos + 1;
    else hi = pos - 1;
  }
  return -1;
}`,
      go: `func interpolationSearch(arr []int, target int) int {
    lo, hi := 0, len(arr)-1
    for lo <= hi && target >= arr[lo] && target <= arr[hi] {
        pos := lo + ((target-arr[lo])*(hi-lo))/(arr[hi]-arr[lo])
        if arr[pos] == target { return pos }
        if arr[pos] < target { lo = pos + 1 } else { hi = pos - 1 }
    }
    return -1
}`,
      csharp: `public static int InterpolationSearch(int[] arr, int target) {
    int lo = 0, hi = arr.Length - 1;
    while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
        int pos = lo + ((target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo]);
        if (arr[pos] == target) return pos;
        if (arr[pos] < target) lo = pos + 1;
        else hi = pos - 1;
    }
    return -1;
}`
    }
  };

  /* ===== 6. EXPONENTIAL SEARCH ===== */
  R['exponential-search'] = {
    name: 'Exponential Search', group: 'searching', defaultInput: '2, 3, 4, 10, 15, 20, 25, 40, 60, 80, 100',
    description: 'Exponential Search tìm phạm vi chứa target bằng cách nhân đôi index (1, 2, 4, 8, ...), sau đó dùng Binary Search trong phạm vi đó. Hiệu quả khi target ở gần đầu mảng.',
    complexity: { timeBest: 'O(1)', timeAvg: 'O(log n)', timeWorst: 'O(log n)', space: 'O(1)' },
    pros: ['Tốt khi target gần đầu', 'O(log n)', 'Kết hợp ưu điểm của cả hai'],
    cons: ['Cần mảng sắp xếp', 'Phức tạp hơn Binary Search đơn thuần'],
    useCases: ['Unbounded search (không biết kích thước)', 'Target thường nhỏ', 'Linked list có index'],
    randomInput() { const a = generateRandomArray(12,1,99).sort((x,y)=>x-y); return a.join(', ') + ' | ' + a[Math.floor(Math.random()*a.length)]; },
    visualize(raw) {
      const parts = raw.split('|'); const arr = parseArrayInput(parts[0]).sort((a,b)=>a-b);
      const target = parseInt((parts[1]||'').trim()) || arr[Math.floor(Math.random()*arr.length)];
      const steps = []; const n = arr.length;
      steps.push({ array: [...arr], highlights: {}, description: `Exponential Search: tìm ${target}` });
      if (arr[0] === target) { steps.push({ array: [...arr], highlights: { found: [0] }, description: '✅ Tìm thấy tại 0' }); return steps; }
      let i = 1;
      while (i < n && arr[i] <= target) {
        steps.push({ array: [...arr], highlights: { active: [i] }, description: `Exponential: i=${i}, a[${i}]=${arr[i]}` });
        i *= 2;
      }
      let lo = Math.floor(i/2), hi = Math.min(i, n-1);
      steps.push({ array: [...arr], highlights: { comparing: [lo, hi] }, description: `Binary search trong [${lo}..${hi}]` });
      while (lo <= hi) {
        const mid = Math.floor((lo+hi)/2);
        steps.push({ array: [...arr], highlights: { active: [mid] }, description: `mid=${mid}, a[${mid}]=${arr[mid]}` });
        if (arr[mid] === target) { steps.push({ array: [...arr], highlights: { found: [mid] }, description: `✅ Tìm thấy ${target} tại ${mid}` }); return steps; }
        if (arr[mid] < target) lo = mid+1; else hi = mid-1;
      }
      steps.push({ array: [...arr], highlights: {}, description: `❌ Không tìm thấy ${target}` });
      return steps;
    },
    render: searchRender,
    code: {
      javascript: `function exponentialSearch(arr, target) {
  if (arr[0] === target) return 0;
  // Tìm phạm vi bằng cách nhân đôi
  let i = 1;
  while (i < arr.length && arr[i] <= target) i *= 2;
  // Binary search trong phạm vi [i/2, min(i, n-1)]
  let lo = Math.floor(i/2), hi = Math.min(i, arr.length-1);
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
      go: `func exponentialSearch(arr []int, target int) int {
    if arr[0] == target { return 0 }
    i := 1
    for i < len(arr) && arr[i] <= target { i *= 2 }
    lo, hi := i/2, min(i, len(arr)-1)
    for lo <= hi {
        mid := (lo + hi) / 2
        if arr[mid] == target { return mid }
        if arr[mid] < target { lo = mid + 1 } else { hi = mid - 1 }
    }
    return -1
}`,
      csharp: `public static int ExponentialSearch(int[] arr, int target) {
    if (arr[0] == target) return 0;
    int i = 1;
    while (i < arr.Length && arr[i] <= target) i *= 2;
    int lo = i / 2, hi = Math.Min(i, arr.Length - 1);
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`
    }
  };
})();

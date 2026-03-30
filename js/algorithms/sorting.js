/* ============================================
   sorting.js — 13 Sorting Algorithms
   Each has: description, complexity, visualize,
   render, and code (Go/C#/JS)
   ============================================ */
(function() {
  const R = window.AlgoRegistry;

  /* Helper: generate sorting steps */
  function sortVizRender(canvas, step) {
    renderArrayBars(canvas, step.array, step.highlights);
  }

  /* ===== 1. BUBBLE SORT ===== */
  R['bubble-sort'] = {
    name: 'Bubble Sort',
    group: 'sorting',
    defaultInput: '64, 34, 25, 12, 22, 11, 90, 45',
    description: 'Bubble Sort là thuật toán sắp xếp đơn giản, lặp lại việc duyệt qua mảng, so sánh các phần tử liền kề và đổi chỗ nếu sai thứ tự. Quá trình lặp cho đến khi không cần đổi chỗ nữa. Tên gọi "Bubble" vì các phần tử lớn sẽ "nổi bọt" lên cuối mảng sau mỗi lần duyệt.',
    complexity: { timeBest: 'O(n)', timeAvg: 'O(n²)', timeWorst: 'O(n²)', space: 'O(1)' },
    pros: ['Dễ hiểu và cài đặt', 'Stable sort', 'Phát hiện mảng đã sắp xếp (best O(n))'],
    cons: ['Rất chậm với dữ liệu lớn O(n²)', 'Nhiều phép hoán đổi', 'Không thực tế cho production'],
    useCases: ['Dạy học thuật toán', 'Dữ liệu rất nhỏ', 'Mảng gần như đã sắp xếp'],
    visualize(raw) {
      const arr = parseArrayInput(raw);
      const steps = [];
      const a = [...arr];
      const n = a.length;
      const sorted = new Set();
      steps.push({ array: [...a], highlights: {}, description: 'Mảng ban đầu' });
      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
          steps.push({ array: [...a], highlights: { comparing: [j, j+1], sorted: [...sorted] }, description: `So sánh a[${j}]=${a[j]} và a[${j+1}]=${a[j+1]}` });
          if (a[j] > a[j+1]) {
            [a[j], a[j+1]] = [a[j+1], a[j]];
            steps.push({ array: [...a], highlights: { swapping: [j, j+1], sorted: [...sorted] }, description: `Đổi chỗ ${a[j+1]} và ${a[j]}` });
            swapped = true;
          }
        }
        sorted.add(n - 1 - i);
        if (!swapped) break;
      }
      for (let i = 0; i < n; i++) sorted.add(i);
      steps.push({ array: [...a], highlights: { sorted: [...sorted] }, description: 'Hoàn tất sắp xếp!' });
      return steps;
    },
    render: sortVizRender,
    code: {
      javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    // Duyệt qua phần chưa sắp xếp
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // Đổi chỗ hai phần tử liền kề
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    // Nếu không có đổi chỗ nào → đã sắp xếp
    if (!swapped) break;
  }
  return arr;
}`,
      go: `func bubbleSort(arr []int) []int {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        swapped := false
        // Duyệt qua phần chưa sắp xếp
        for j := 0; j < n-1-i; j++ {
            if arr[j] > arr[j+1] {
                // Đổi chỗ hai phần tử liền kề
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = true
            }
        }
        // Nếu không có đổi chỗ nào → đã sắp xếp
        if !swapped {
            break
        }
    }
    return arr
}`,
      csharp: `public static int[] BubbleSort(int[] arr) {
    int n = arr.Length;
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        // Duyệt qua phần chưa sắp xếp
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                // Đổi chỗ hai phần tử liền kề
                (arr[j], arr[j + 1]) = (arr[j + 1], arr[j]);
                swapped = true;
            }
        }
        // Nếu không có đổi chỗ nào → đã sắp xếp
        if (!swapped) break;
    }
    return arr;
}`
    }
  };

  /* ===== 2. SELECTION SORT ===== */
  R['selection-sort'] = {
    name: 'Selection Sort',
    group: 'sorting',
    defaultInput: '64, 25, 12, 22, 11, 90, 34',
    description: 'Selection Sort tìm phần tử nhỏ nhất trong phần chưa sắp xếp và đặt nó vào đầu. Lặp lại cho đến khi toàn bộ mảng được sắp xếp. Thuật toán chia mảng thành hai phần: đã sắp xếp (bên trái) và chưa sắp xếp (bên phải).',
    complexity: { timeBest: 'O(n²)', timeAvg: 'O(n²)', timeWorst: 'O(n²)', space: 'O(1)' },
    pros: ['Đơn giản, dễ cài đặt', 'Ít phép hoán đổi (O(n))', 'Tốt khi bộ nhớ ghi chậm'],
    cons: ['Luôn O(n²) kể cả khi đã sắp xếp', 'Không stable', 'Chậm với dữ liệu lớn'],
    useCases: ['Dữ liệu nhỏ', 'Khi chi phí ghi (write) cao hơn đọc', 'Dạy học'],
    visualize(raw) {
      const arr = parseArrayInput(raw);
      const steps = [];
      const a = [...arr];
      const n = a.length;
      const sorted = new Set();
      steps.push({ array: [...a], highlights: {}, description: 'Mảng ban đầu' });
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          steps.push({ array: [...a], highlights: { active: [minIdx], comparing: [j], sorted: [...sorted] }, description: `Tìm min: so sánh a[${j}]=${a[j]} với min=${a[minIdx]}` });
          if (a[j] < a[minIdx]) minIdx = j;
        }
        if (minIdx !== i) {
          steps.push({ array: [...a], highlights: { swapping: [i, minIdx], sorted: [...sorted] }, description: `Đổi chỗ a[${i}]=${a[i]} với min a[${minIdx}]=${a[minIdx]}` });
          [a[i], a[minIdx]] = [a[minIdx], a[i]];
        }
        sorted.add(i);
      }
      sorted.add(n - 1);
      steps.push({ array: [...a], highlights: { sorted: [...sorted] }, description: 'Hoàn tất sắp xếp!' });
      return steps;
    },
    render: sortVizRender,
    code: {
      javascript: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    // Tìm phần tử nhỏ nhất trong phần chưa sắp xếp
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    // Đổi chỗ phần tử nhỏ nhất với vị trí i
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,
      go: `func selectionSort(arr []int) []int {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        minIdx := i
        // Tìm phần tử nhỏ nhất trong phần chưa sắp xếp
        for j := i + 1; j < n; j++ {
            if arr[j] < arr[minIdx] {
                minIdx = j
            }
        }
        // Đổi chỗ phần tử nhỏ nhất với vị trí i
        if minIdx != i {
            arr[i], arr[minIdx] = arr[minIdx], arr[i]
        }
    }
    return arr
}`,
      csharp: `public static int[] SelectionSort(int[] arr) {
    int n = arr.Length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        // Tìm phần tử nhỏ nhất trong phần chưa sắp xếp
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        // Đổi chỗ phần tử nhỏ nhất với vị trí i
        if (minIdx != i) {
            (arr[i], arr[minIdx]) = (arr[minIdx], arr[i]);
        }
    }
    return arr;
}`
    }
  };

  /* ===== 3. INSERTION SORT ===== */
  R['insertion-sort'] = {
    name: 'Insertion Sort',
    group: 'sorting',
    defaultInput: '12, 11, 13, 5, 6, 7, 45, 23',
    description: 'Insertion Sort xây dựng mảng đã sắp xếp từng phần tử một. Với mỗi phần tử, nó tìm vị trí đúng trong phần đã sắp xếp và chèn vào. Giống cách sắp xếp bài trong tay khi chơi bài.',
    complexity: { timeBest: 'O(n)', timeAvg: 'O(n²)', timeWorst: 'O(n²)', space: 'O(1)' },
    pros: ['Hiệu quả với dữ liệu nhỏ', 'Stable sort', 'Adaptive (nhanh với mảng gần sắp xếp)', 'Online algorithm'],
    cons: ['O(n²) trung bình và xấu nhất', 'Nhiều phép dịch chuyển', 'Không phù hợp dữ liệu lớn'],
    useCases: ['Dữ liệu nhỏ hoặc gần sắp xếp', 'Là phần của TimSort và IntroSort', 'Stream data'],
    visualize(raw) {
      const arr = parseArrayInput(raw);
      const steps = [];
      const a = [...arr];
      const n = a.length;
      const sorted = new Set([0]);
      steps.push({ array: [...a], highlights: { sorted: [0] }, description: 'Phần tử đầu tiên coi như đã sắp xếp' });
      for (let i = 1; i < n; i++) {
        const key = a[i];
        steps.push({ array: [...a], highlights: { active: [i], sorted: [...sorted] }, description: `Chọn key = ${key} tại vị trí ${i}` });
        let j = i - 1;
        while (j >= 0 && a[j] > key) {
          a[j + 1] = a[j];
          steps.push({ array: [...a], highlights: { comparing: [j], active: [j+1], sorted: [...sorted] }, description: `Dịch a[${j}]=${a[j]} sang phải` });
          j--;
        }
        a[j + 1] = key;
        sorted.add(i);
        steps.push({ array: [...a], highlights: { found: [j+1], sorted: [...sorted] }, description: `Chèn key=${key} vào vị trí ${j+1}` });
      }
      steps.push({ array: [...a], highlights: { sorted: Array.from({length:n},(_,i)=>i) }, description: 'Hoàn tất sắp xếp!' });
      return steps;
    },
    render: sortVizRender,
    code: {
      javascript: `function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    // Dịch các phần tử lớn hơn key sang phải
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    // Chèn key vào vị trí đúng
    arr[j + 1] = key;
  }
  return arr;
}`,
      go: `func insertionSort(arr []int) []int {
    n := len(arr)
    for i := 1; i < n; i++ {
        key := arr[i]
        j := i - 1
        // Dịch các phần tử lớn hơn key sang phải
        for j >= 0 && arr[j] > key {
            arr[j+1] = arr[j]
            j--
        }
        // Chèn key vào vị trí đúng
        arr[j+1] = key
    }
    return arr
}`,
      csharp: `public static int[] InsertionSort(int[] arr) {
    int n = arr.Length;
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        // Dịch các phần tử lớn hơn key sang phải
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        // Chèn key vào vị trí đúng
        arr[j + 1] = key;
    }
    return arr;
}`
    }
  };

  /* ===== 4. MERGE SORT ===== */
  R['merge-sort'] = {
    name: 'Merge Sort',
    group: 'sorting',
    defaultInput: '38, 27, 43, 3, 9, 82, 10',
    description: 'Merge Sort sử dụng chiến lược chia để trị: chia mảng thành hai nửa, đệ quy sắp xếp từng nửa, sau đó trộn (merge) hai nửa đã sắp xếp lại thành một mảng hoàn chỉnh. Đây là thuật toán sắp xếp ổn định với hiệu suất O(n log n) đảm bảo.',
    complexity: { timeBest: 'O(n log n)', timeAvg: 'O(n log n)', timeWorst: 'O(n log n)', space: 'O(n)' },
    pros: ['Luôn O(n log n)', 'Stable sort', 'Tốt cho linked list', 'Dễ song song hóa'],
    cons: ['Cần O(n) bộ nhớ phụ', 'Chậm hơn QuickSort trong thực tế', 'Không in-place'],
    useCases: ['Sắp xếp linked list', 'External sorting (file lớn)', 'Cần stable sort với hiệu suất đảm bảo'],
    visualize(raw) {
      const arr = parseArrayInput(raw);
      const steps = [];
      const a = [...arr];
      steps.push({ array: [...a], highlights: {}, description: 'Mảng ban đầu' });
      function merge(a, l, m, r) {
        const left = a.slice(l, m + 1);
        const right = a.slice(m + 1, r + 1);
        let i = 0, j = 0, k = l;
        while (i < left.length && j < right.length) {
          steps.push({ array: [...a], highlights: { comparing: [l+i, m+1+j], active: Array.from({length:r-l+1},(_,x)=>l+x) }, description: `Trộn: so sánh ${left[i]} và ${right[j]}` });
          if (left[i] <= right[j]) { a[k++] = left[i++]; }
          else { a[k++] = right[j++]; }
        }
        while (i < left.length) { a[k++] = left[i++]; }
        while (j < right.length) { a[k++] = right[j++]; }
        steps.push({ array: [...a], highlights: { found: Array.from({length:r-l+1},(_,x)=>l+x) }, description: `Đã trộn xong đoạn [${l}..${r}]` });
      }
      function mergeSort(a, l, r) {
        if (l >= r) return;
        const m = Math.floor((l + r) / 2);
        steps.push({ array: [...a], highlights: { active: Array.from({length:r-l+1},(_,x)=>l+x) }, description: `Chia đoạn [${l}..${r}], mid=${m}` });
        mergeSort(a, l, m);
        mergeSort(a, m + 1, r);
        merge(a, l, m, r);
      }
      mergeSort(a, 0, a.length - 1);
      steps.push({ array: [...a], highlights: { sorted: Array.from({length:a.length},(_,i)=>i) }, description: 'Hoàn tất sắp xếp!' });
      return steps;
    },
    render: sortVizRender,
    code: {
      javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  // Chia mảng thành hai nửa
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  // Trộn hai nửa đã sắp xếp
  return merge(left, right);
}
function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
      go: `func mergeSort(arr []int) []int {
    if len(arr) <= 1 {
        return arr
    }
    mid := len(arr) / 2
    // Chia mảng thành hai nửa
    left := mergeSort(arr[:mid])
    right := mergeSort(arr[mid:])
    // Trộn hai nửa đã sắp xếp
    return merge(left, right)
}
func merge(left, right []int) []int {
    result := make([]int, 0, len(left)+len(right))
    i, j := 0, 0
    for i < len(left) && j < len(right) {
        if left[i] <= right[j] {
            result = append(result, left[i]); i++
        } else {
            result = append(result, right[j]); j++
        }
    }
    result = append(result, left[i:]...)
    result = append(result, right[j:]...)
    return result
}`,
      csharp: `public static void MergeSort(int[] arr, int l, int r) {
    if (l >= r) return;
    int mid = (l + r) / 2;
    // Chia mảng thành hai nửa
    MergeSort(arr, l, mid);
    MergeSort(arr, mid + 1, r);
    // Trộn hai nửa đã sắp xếp
    Merge(arr, l, mid, r);
}
static void Merge(int[] arr, int l, int m, int r) {
    int[] left = arr[l..(m+1)];
    int[] right = arr[(m+1)..(r+1)];
    int i = 0, j = 0, k = l;
    while (i < left.Length && j < right.Length) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else arr[k++] = right[j++];
    }
    while (i < left.Length) arr[k++] = left[i++];
    while (j < right.Length) arr[k++] = right[j++];
}`
    }
  };

  /* ===== 5. QUICK SORT ===== */
  R['quick-sort'] = {
    name: 'Quick Sort',
    group: 'sorting',
    defaultInput: '10, 80, 30, 90, 40, 50, 70',
    description: 'Quick Sort chọn một phần tử làm pivot, phân hoạch mảng sao cho các phần tử nhỏ hơn pivot ở bên trái, lớn hơn ở bên phải. Đệ quy sắp xếp hai phần. Trung bình rất nhanh O(n log n), là thuật toán sắp xếp phổ biến nhất trong thực tế.',
    complexity: { timeBest: 'O(n log n)', timeAvg: 'O(n log n)', timeWorst: 'O(n²)', space: 'O(log n)' },
    pros: ['Rất nhanh trong thực tế', 'In-place (O(log n) stack)', 'Cache-friendly'],
    cons: ['Worst case O(n²)', 'Không stable', 'Chọn pivot kém → hiệu suất thấp'],
    useCases: ['Sắp xếp mảng lớn', 'Standard library sort', 'Khi cần in-place và nhanh'],
    visualize(raw) {
      const arr = parseArrayInput(raw);
      const steps = [];
      const a = [...arr];
      const sorted = new Set();
      steps.push({ array: [...a], highlights: {}, description: 'Mảng ban đầu' });
      function partition(a, lo, hi) {
        const pivot = a[hi];
        steps.push({ array: [...a], highlights: { pivot: hi, active: Array.from({length:hi-lo+1},(_,x)=>lo+x), sorted: [...sorted] }, description: `Chọn pivot = ${pivot} tại vị trí ${hi}` });
        let i = lo - 1;
        for (let j = lo; j < hi; j++) {
          steps.push({ array: [...a], highlights: { comparing: [j], pivot: hi, sorted: [...sorted] }, description: `So sánh a[${j}]=${a[j]} với pivot=${pivot}` });
          if (a[j] < pivot) {
            i++;
            [a[i], a[j]] = [a[j], a[i]];
            if (i !== j) steps.push({ array: [...a], highlights: { swapping: [i, j], pivot: hi, sorted: [...sorted] }, description: `Đổi chỗ a[${i}] và a[${j}]` });
          }
        }
        [a[i+1], a[hi]] = [a[hi], a[i+1]];
        sorted.add(i+1);
        steps.push({ array: [...a], highlights: { found: [i+1], sorted: [...sorted] }, description: `Pivot ${pivot} vào đúng vị trí ${i+1}` });
        return i + 1;
      }
      function qs(a, lo, hi) {
        if (lo >= hi) { if (lo === hi) sorted.add(lo); return; }
        const p = partition(a, lo, hi);
        qs(a, lo, p - 1);
        qs(a, p + 1, hi);
      }
      qs(a, 0, a.length - 1);
      for (let i = 0; i < a.length; i++) sorted.add(i);
      steps.push({ array: [...a], highlights: { sorted: [...sorted] }, description: 'Hoàn tất sắp xếp!' });
      return steps;
    },
    render: sortVizRender,
    code: {
      javascript: `function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return;
  const p = partition(arr, lo, hi);
  quickSort(arr, lo, p - 1);
  quickSort(arr, p + 1, hi);
}
function partition(arr, lo, hi) {
  const pivot = arr[hi]; // Chọn phần tử cuối làm pivot
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Đổi chỗ
    }
  }
  [arr[i+1], arr[hi]] = [arr[hi], arr[i+1]]; // Đặt pivot vào đúng vị trí
  return i + 1;
}`,
      go: `func quickSort(arr []int, lo, hi int) {
    if lo >= hi { return }
    p := partition(arr, lo, hi)
    quickSort(arr, lo, p-1)
    quickSort(arr, p+1, hi)
}
func partition(arr []int, lo, hi int) int {
    pivot := arr[hi] // Chọn phần tử cuối làm pivot
    i := lo - 1
    for j := lo; j < hi; j++ {
        if arr[j] < pivot {
            i++
            arr[i], arr[j] = arr[j], arr[i] // Đổi chỗ
        }
    }
    arr[i+1], arr[hi] = arr[hi], arr[i+1] // Đặt pivot vào đúng vị trí
    return i + 1
}`,
      csharp: `public static void QuickSort(int[] arr, int lo, int hi) {
    if (lo >= hi) return;
    int p = Partition(arr, lo, hi);
    QuickSort(arr, lo, p - 1);
    QuickSort(arr, p + 1, hi);
}
static int Partition(int[] arr, int lo, int hi) {
    int pivot = arr[hi]; // Chọn phần tử cuối làm pivot
    int i = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (arr[j] < pivot) {
            i++;
            (arr[i], arr[j]) = (arr[j], arr[i]); // Đổi chỗ
        }
    }
    (arr[i+1], arr[hi]) = (arr[hi], arr[i+1]); // Đặt pivot vào đúng vị trí
    return i + 1;
}`
    }
  };

  /* ===== 6. HEAP SORT ===== */
  R['heap-sort'] = {
    name: 'Heap Sort',
    group: 'sorting',
    defaultInput: '12, 11, 13, 5, 6, 7, 45, 23',
    description: 'Heap Sort sử dụng cấu trúc dữ liệu heap (max-heap) để sắp xếp. Đầu tiên xây dựng max-heap từ mảng, sau đó liên tục lấy phần tử lớn nhất (gốc) và đặt vào cuối mảng, rồi heapify lại phần còn lại.',
    complexity: { timeBest: 'O(n log n)', timeAvg: 'O(n log n)', timeWorst: 'O(n log n)', space: 'O(1)' },
    pros: ['Luôn O(n log n)', 'In-place', 'Không có worst case xấu như QuickSort'],
    cons: ['Không stable', 'Chậm hơn QuickSort trong thực tế (cache-unfriendly)', 'Nhiều phép swap'],
    useCases: ['Khi cần đảm bảo O(n log n)', 'Priority queue', 'Là phần của IntroSort'],
    visualize(raw) {
      const arr = parseArrayInput(raw);
      const steps = []; const a = [...arr]; const n = a.length; const sorted = new Set();
      steps.push({ array: [...a], highlights: {}, description: 'Mảng ban đầu' });
      function heapify(a, n, i) {
        let largest = i, l = 2*i+1, r = 2*i+2;
        if (l < n && a[l] > a[largest]) largest = l;
        if (r < n && a[r] > a[largest]) largest = r;
        if (largest !== i) {
          steps.push({ array: [...a], highlights: { comparing: [i, largest], sorted: [...sorted] }, description: `Heapify: so sánh a[${i}]=${a[i]} với a[${largest}]=${a[largest]}` });
          [a[i], a[largest]] = [a[largest], a[i]];
          steps.push({ array: [...a], highlights: { swapping: [i, largest], sorted: [...sorted] }, description: `Đổi chỗ a[${i}] và a[${largest}]` });
          heapify(a, n, largest);
        }
      }
      for (let i = Math.floor(n/2)-1; i >= 0; i--) heapify(a, n, i);
      steps.push({ array: [...a], highlights: {}, description: 'Đã xây dựng Max-Heap' });
      for (let i = n-1; i > 0; i--) {
        [a[0], a[i]] = [a[i], a[0]];
        sorted.add(i);
        steps.push({ array: [...a], highlights: { swapping: [0, i], sorted: [...sorted] }, description: `Đưa max=${a[i]} về vị trí ${i}` });
        heapify(a, i, 0);
      }
      sorted.add(0);
      steps.push({ array: [...a], highlights: { sorted: [...sorted] }, description: 'Hoàn tất sắp xếp!' });
      return steps;
    },
    render: sortVizRender,
    code: {
      javascript: `function heapSort(arr) {
  const n = arr.length;
  // Xây dựng max-heap
  for (let i = Math.floor(n/2) - 1; i >= 0; i--)
    heapify(arr, n, i);
  // Lần lượt lấy phần tử max ra
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}
function heapify(arr, n, i) {
  let largest = i, l = 2*i+1, r = 2*i+2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
      go: `func heapSort(arr []int) {
    n := len(arr)
    // Xây dựng max-heap
    for i := n/2 - 1; i >= 0; i-- {
        heapify(arr, n, i)
    }
    // Lần lượt lấy phần tử max ra
    for i := n - 1; i > 0; i-- {
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    }
}
func heapify(arr []int, n, i int) {
    largest, l, r := i, 2*i+1, 2*i+2
    if l < n && arr[l] > arr[largest] { largest = l }
    if r < n && arr[r] > arr[largest] { largest = r }
    if largest != i {
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)
    }
}`,
      csharp: `public static void HeapSort(int[] arr) {
    int n = arr.Length;
    // Xây dựng max-heap
    for (int i = n / 2 - 1; i >= 0; i--)
        Heapify(arr, n, i);
    // Lần lượt lấy phần tử max ra
    for (int i = n - 1; i > 0; i--) {
        (arr[0], arr[i]) = (arr[i], arr[0]);
        Heapify(arr, i, 0);
    }
}
static void Heapify(int[] arr, int n, int i) {
    int largest = i, l = 2*i+1, r = 2*i+2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        (arr[i], arr[largest]) = (arr[largest], arr[i]);
        Heapify(arr, n, largest);
    }
}`
    }
  };

  /* ===== 7. COUNTING SORT ===== */
  R['counting-sort'] = {
    name: 'Counting Sort',
    group: 'sorting',
    defaultInput: '4, 2, 2, 8, 3, 3, 1, 7, 5',
    description: 'Counting Sort đếm số lần xuất hiện của mỗi giá trị, sau đó dùng mảng đếm để xây dựng mảng kết quả. Không dùng so sánh nên có thể đạt O(n+k) với k là giá trị lớn nhất. Chỉ hoạt động với số nguyên không âm.',
    complexity: { timeBest: 'O(n+k)', timeAvg: 'O(n+k)', timeWorst: 'O(n+k)', space: 'O(n+k)' },
    pros: ['Rất nhanh O(n+k)', 'Stable sort', 'Không dùng so sánh'],
    cons: ['Chỉ cho số nguyên', 'Tốn bộ nhớ nếu k lớn', 'Không phù hợp dữ liệu phân tán'],
    useCases: ['Dữ liệu nguyên có phạm vi nhỏ', 'Là bước con của Radix Sort', 'Đếm tần suất'],
    visualize(raw) {
      const arr = parseArrayInput(raw);
      const steps = []; const a = [...arr]; const n = a.length;
      steps.push({ array: [...a], highlights: {}, description: 'Mảng ban đầu' });
      const max = Math.max(...a);
      const count = new Array(max + 1).fill(0);
      for (let i = 0; i < n; i++) {
        count[a[i]]++;
        steps.push({ array: [...a], highlights: { active: [i] }, description: `Đếm: count[${a[i]}] = ${count[a[i]]}` });
      }
      let idx = 0;
      for (let i = 0; i <= max; i++) {
        while (count[i] > 0) {
          a[idx] = i; count[i]--;
          steps.push({ array: [...a], highlights: { found: [idx] }, description: `Đặt giá trị ${i} vào vị trí ${idx}` });
          idx++;
        }
      }
      steps.push({ array: [...a], highlights: { sorted: Array.from({length:n},(_,i)=>i) }, description: 'Hoàn tất sắp xếp!' });
      return steps;
    },
    render: sortVizRender,
    code: {
      javascript: `function countingSort(arr) {
  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);
  // Đếm số lần xuất hiện
  for (const num of arr) count[num]++;
  // Xây dựng mảng kết quả
  let idx = 0;
  for (let i = 0; i <= max; i++) {
    while (count[i] > 0) {
      arr[idx++] = i;
      count[i]--;
    }
  }
  return arr;
}`,
      go: `func countingSort(arr []int) []int {
    max := arr[0]
    for _, v := range arr {
        if v > max { max = v }
    }
    count := make([]int, max+1)
    // Đếm số lần xuất hiện
    for _, v := range arr {
        count[v]++
    }
    // Xây dựng mảng kết quả
    idx := 0
    for i := 0; i <= max; i++ {
        for count[i] > 0 {
            arr[idx] = i; idx++; count[i]--
        }
    }
    return arr
}`,
      csharp: `public static int[] CountingSort(int[] arr) {
    int max = arr.Max();
    int[] count = new int[max + 1];
    // Đếm số lần xuất hiện
    foreach (int num in arr) count[num]++;
    // Xây dựng mảng kết quả
    int idx = 0;
    for (int i = 0; i <= max; i++) {
        while (count[i] > 0) {
            arr[idx++] = i;
            count[i]--;
        }
    }
    return arr;
}`
    }
  };

  /* ===== 8. RADIX SORT ===== */
  R['radix-sort'] = {
    name: 'Radix Sort',
    group: 'sorting',
    defaultInput: '170, 45, 75, 90, 802, 24, 2, 66',
    description: 'Radix Sort sắp xếp số nguyên theo từng chữ số, từ hàng đơn vị đến hàng cao nhất. Mỗi bước dùng Counting Sort ổn định. Không so sánh trực tiếp các phần tử, hiệu quả O(d*(n+b)) với d là số chữ số, b là cơ số.',
    complexity: { timeBest: 'O(d·n)', timeAvg: 'O(d·n)', timeWorst: 'O(d·n)', space: 'O(n+b)' },
    pros: ['Nhanh hơn comparison sort khi d nhỏ', 'Stable', 'Tốt cho dữ liệu nguyên lớn'],
    cons: ['Chỉ cho số nguyên', 'Cần biết số chữ số max', 'Tốn bộ nhớ phụ'],
    useCases: ['Sắp xếp số nguyên lớn', 'Sắp xếp chuỗi cùng độ dài', 'Database sorting'],
    visualize(raw) {
      const arr = parseArrayInput(raw);
      const steps = []; const a = [...arr]; const n = a.length;
      steps.push({ array: [...a], highlights: {}, description: 'Mảng ban đầu' });
      const max = Math.max(...a);
      for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        const buckets = Array.from({length:10}, ()=>[]);
        for (let i = 0; i < n; i++) {
          const digit = Math.floor(a[i]/exp) % 10;
          buckets[digit].push(a[i]);
          steps.push({ array: [...a], highlights: { active: [i] }, description: `Chữ số hàng ${exp}: a[${i}]=${a[i]} → bucket ${digit}` });
        }
        let idx = 0;
        for (let d = 0; d < 10; d++) {
          for (const val of buckets[d]) { a[idx++] = val; }
        }
        steps.push({ array: [...a], highlights: { found: Array.from({length:n},(_,i)=>i) }, description: `Sau lượt hàng ${exp}: [${a.join(', ')}]` });
      }
      steps.push({ array: [...a], highlights: { sorted: Array.from({length:n},(_,i)=>i) }, description: 'Hoàn tất sắp xếp!' });
      return steps;
    },
    render: sortVizRender,
    code: {
      javascript: `function radixSort(arr) {
  const max = Math.max(...arr);
  // Sắp xếp theo từng hàng chữ số
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp);
  }
  return arr;
}
function countingSortByDigit(arr, exp) {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);
  for (let i = 0; i < n; i++)
    count[Math.floor(arr[i] / exp) % 10]++;
  for (let i = 1; i < 10; i++)
    count[i] += count[i-1];
  for (let i = n-1; i >= 0; i--) {
    const d = Math.floor(arr[i] / exp) % 10;
    output[count[d]-1] = arr[i];
    count[d]--;
  }
  for (let i = 0; i < n; i++) arr[i] = output[i];
}`,
      go: `func radixSort(arr []int) {
    max := arr[0]
    for _, v := range arr { if v > max { max = v } }
    // Sắp xếp theo từng hàng chữ số
    for exp := 1; max/exp > 0; exp *= 10 {
        countSortByDigit(arr, exp)
    }
}
func countSortByDigit(arr []int, exp int) {
    n := len(arr)
    output := make([]int, n)
    count := make([]int, 10)
    for i := 0; i < n; i++ {
        count[(arr[i]/exp)%10]++
    }
    for i := 1; i < 10; i++ { count[i] += count[i-1] }
    for i := n - 1; i >= 0; i-- {
        d := (arr[i] / exp) % 10
        output[count[d]-1] = arr[i]
        count[d]--
    }
    copy(arr, output)
}`,
      csharp: `public static void RadixSort(int[] arr) {
    int max = arr.Max();
    // Sắp xếp theo từng hàng chữ số
    for (int exp = 1; max / exp > 0; exp *= 10)
        CountSortByDigit(arr, exp);
}
static void CountSortByDigit(int[] arr, int exp) {
    int n = arr.Length;
    int[] output = new int[n];
    int[] count = new int[10];
    for (int i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++)
        count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        int d = (arr[i] / exp) % 10;
        output[count[d] - 1] = arr[i];
        count[d]--;
    }
    Array.Copy(output, arr, n);
}`
    }
  };

  /* ===== 9. BUCKET SORT ===== */
  R['bucket-sort'] = {
    name: 'Bucket Sort',
    group: 'sorting',
    defaultInput: '42, 32, 23, 52, 25, 47, 51, 33',
    description: 'Bucket Sort phân phối phần tử vào các "bucket" dựa trên giá trị, sắp xếp từng bucket riêng biệt (thường dùng Insertion Sort), rồi nối lại. Hiệu quả khi dữ liệu phân bố đều.',
    complexity: { timeBest: 'O(n+k)', timeAvg: 'O(n+k)', timeWorst: 'O(n²)', space: 'O(n+k)' },
    pros: ['Rất nhanh khi dữ liệu phân bố đều', 'Dễ cài đặt', 'Có thể dùng sort khác cho mỗi bucket'],
    cons: ['Hiệu suất phụ thuộc phân bố', 'Cần biết range dữ liệu', 'Tốn bộ nhớ phụ'],
    useCases: ['Dữ liệu phân bố đều', 'Sắp xếp số thực trong [0,1)', 'External sorting'],
    visualize(raw) {
      const arr = parseArrayInput(raw);
      const steps = []; const a = [...arr]; const n = a.length;
      steps.push({ array: [...a], highlights: {}, description: 'Mảng ban đầu' });
      const max = Math.max(...a) + 1;
      const bucketCount = Math.max(3, Math.ceil(Math.sqrt(n)));
      const buckets = Array.from({length: bucketCount}, () => []);
      for (let i = 0; i < n; i++) {
        const bi = Math.floor(a[i] * bucketCount / max);
        buckets[bi].push(a[i]);
        steps.push({ array: [...a], highlights: { active: [i] }, description: `Đưa ${a[i]} vào bucket ${bi}` });
      }
      let idx = 0;
      for (let i = 0; i < bucketCount; i++) {
        buckets[i].sort((x,y) => x - y);
        for (const val of buckets[i]) {
          a[idx] = val;
          steps.push({ array: [...a], highlights: { found: [idx] }, description: `Bucket ${i}: đặt ${val} vào vị trí ${idx}` });
          idx++;
        }
      }
      steps.push({ array: [...a], highlights: { sorted: Array.from({length:n},(_,i)=>i) }, description: 'Hoàn tất sắp xếp!' });
      return steps;
    },
    render: sortVizRender,
    code: {
      javascript: `function bucketSort(arr) {
  const n = arr.length;
  const max = Math.max(...arr) + 1;
  const bucketCount = Math.ceil(Math.sqrt(n));
  const buckets = Array.from({length: bucketCount}, () => []);
  // Phân phối vào buckets
  for (const num of arr) {
    const bi = Math.floor(num * bucketCount / max);
    buckets[bi].push(num);
  }
  // Sắp xếp từng bucket và nối lại
  let idx = 0;
  for (const bucket of buckets) {
    bucket.sort((a, b) => a - b);
    for (const val of bucket) arr[idx++] = val;
  }
  return arr;
}`,
      go: `func bucketSort(arr []int) {
    n := len(arr)
    max := 0
    for _, v := range arr { if v > max { max = v } }
    max++
    bc := int(math.Ceil(math.Sqrt(float64(n))))
    buckets := make([][]int, bc)
    // Phân phối vào buckets
    for _, v := range arr {
        bi := v * bc / max
        buckets[bi] = append(buckets[bi], v)
    }
    // Sắp xếp từng bucket và nối lại
    idx := 0
    for _, b := range buckets {
        sort.Ints(b)
        for _, v := range b { arr[idx] = v; idx++ }
    }
}`,
      csharp: `public static void BucketSort(int[] arr) {
    int n = arr.Length;
    int max = arr.Max() + 1;
    int bc = (int)Math.Ceiling(Math.Sqrt(n));
    var buckets = new List<int>[bc];
    for (int i = 0; i < bc; i++) buckets[i] = new List<int>();
    // Phân phối vào buckets
    foreach (int num in arr) {
        int bi = num * bc / max;
        buckets[bi].Add(num);
    }
    // Sắp xếp từng bucket và nối lại
    int idx = 0;
    foreach (var bucket in buckets) {
        bucket.Sort();
        foreach (int val in bucket) arr[idx++] = val;
    }
}`
    }
  };

  /* ===== 10. TIM SORT ===== */
  R['tim-sort'] = {
    name: 'Tim Sort',
    group: 'sorting',
    defaultInput: '5, 21, 7, 23, 19, 10, 15, 3, 28, 8',
    description: 'Tim Sort kết hợp Merge Sort và Insertion Sort. Chia mảng thành các "run" nhỏ, sắp xếp mỗi run bằng Insertion Sort, rồi merge các run lại. Đây là thuật toán mặc định trong Python và Java. Tận dụng tốt dữ liệu đã sắp xếp một phần.',
    complexity: { timeBest: 'O(n)', timeAvg: 'O(n log n)', timeWorst: 'O(n log n)', space: 'O(n)' },
    pros: ['Adaptive — nhanh với dữ liệu gần sắp xếp', 'Stable sort', 'Dùng trong Python, Java', 'O(n) best case'],
    cons: ['Cài đặt phức tạp', 'Cần O(n) bộ nhớ phụ', 'Overhead cho dữ liệu nhỏ'],
    useCases: ['Standard library (Python, Java)', 'Dữ liệu thực tế (thường có phần đã sắp xếp)', 'Cần stable sort hiệu quả'],
    visualize(raw) {
      const arr = parseArrayInput(raw);
      const steps = []; const a = [...arr]; const n = a.length;
      const RUN = Math.min(4, n);
      steps.push({ array: [...a], highlights: {}, description: `Mảng ban đầu, RUN size = ${RUN}` });
      for (let i = 0; i < n; i += RUN) {
        const end = Math.min(i + RUN, n);
        for (let j = i + 1; j < end; j++) {
          const key = a[j]; let k = j - 1;
          while (k >= i && a[k] > key) { a[k+1] = a[k]; k--; }
          a[k+1] = key;
        }
        steps.push({ array: [...a], highlights: { found: Array.from({length: end-i}, (_,x)=>i+x) }, description: `Insertion Sort run [${i}..${end-1}]` });
      }
      for (let size = RUN; size < n; size *= 2) {
        for (let left = 0; left < n; left += 2 * size) {
          const mid = Math.min(left + size - 1, n - 1);
          const right = Math.min(left + 2 * size - 1, n - 1);
          if (mid < right) {
            const L = a.slice(left, mid+1), Ri = a.slice(mid+1, right+1);
            let ii = 0, jj = 0, kk = left;
            while (ii < L.length && jj < Ri.length) {
              if (L[ii] <= Ri[jj]) a[kk++] = L[ii++]; else a[kk++] = Ri[jj++];
            }
            while (ii < L.length) a[kk++] = L[ii++];
            while (jj < Ri.length) a[kk++] = Ri[jj++];
            steps.push({ array: [...a], highlights: { active: Array.from({length:right-left+1},(_,x)=>left+x) }, description: `Merge [${left}..${mid}] + [${mid+1}..${right}]` });
          }
        }
      }
      steps.push({ array: [...a], highlights: { sorted: Array.from({length:n},(_,i)=>i) }, description: 'Hoàn tất sắp xếp!' });
      return steps;
    },
    render: sortVizRender,
    code: {
      javascript: `function timSort(arr) {
  const n = arr.length, RUN = 32;
  // Insertion sort các run nhỏ
  for (let i = 0; i < n; i += RUN) {
    for (let j = i+1; j < Math.min(i+RUN, n); j++) {
      let key = arr[j], k = j-1;
      while (k >= i && arr[k] > key) { arr[k+1] = arr[k]; k--; }
      arr[k+1] = key;
    }
  }
  // Merge các run
  for (let size = RUN; size < n; size *= 2) {
    for (let left = 0; left < n; left += 2*size) {
      let mid = Math.min(left+size-1, n-1);
      let right = Math.min(left+2*size-1, n-1);
      if (mid < right) merge(arr, left, mid, right);
    }
  }
}`,
      go: `func timSort(arr []int) {
    n := len(arr)
    const RUN = 32
    // Insertion sort các run nhỏ
    for i := 0; i < n; i += RUN {
        end := min(i+RUN, n)
        for j := i + 1; j < end; j++ {
            key, k := arr[j], j-1
            for k >= i && arr[k] > key { arr[k+1] = arr[k]; k-- }
            arr[k+1] = key
        }
    }
    // Merge các run
    for size := RUN; size < n; size *= 2 {
        for left := 0; left < n; left += 2 * size {
            mid := min(left+size-1, n-1)
            right := min(left+2*size-1, n-1)
            if mid < right { merge(arr, left, mid, right) }
        }
    }
}`,
      csharp: `public static void TimSort(int[] arr) {
    int n = arr.Length; const int RUN = 32;
    // Insertion sort các run nhỏ
    for (int i = 0; i < n; i += RUN) {
        int end = Math.Min(i + RUN, n);
        for (int j = i + 1; j < end; j++) {
            int key = arr[j], k = j - 1;
            while (k >= i && arr[k] > key) { arr[k+1] = arr[k]; k--; }
            arr[k+1] = key;
        }
    }
    // Merge các run
    for (int size = RUN; size < n; size *= 2) {
        for (int left = 0; left < n; left += 2 * size) {
            int mid = Math.Min(left+size-1, n-1);
            int right = Math.Min(left+2*size-1, n-1);
            if (mid < right) Merge(arr, left, mid, right);
        }
    }
}`
    }
  };

  /* ===== 11. SHELL SORT ===== */
  R['shell-sort'] = {
    name: 'Shell Sort',
    group: 'sorting',
    defaultInput: '23, 12, 1, 8, 34, 54, 2, 3',
    description: 'Shell Sort là cải tiến của Insertion Sort bằng cách cho phép đổi chỗ các phần tử cách xa nhau. Dùng gap giảm dần (thường chia 2), với mỗi gap thực hiện insertion sort cho các phần tử cách nhau gap vị trí.',
    complexity: { timeBest: 'O(n log n)', timeAvg: 'O(n^1.25)', timeWorst: 'O(n²)', space: 'O(1)' },
    pros: ['Nhanh hơn Insertion Sort', 'In-place, ít bộ nhớ phụ', 'Dễ cài đặt'],
    cons: ['Không stable', 'Hiệu suất phụ thuộc gap sequence', 'Phân tích complexity khó'],
    useCases: ['Dữ liệu trung bình', 'Embedded systems (ít bộ nhớ)', 'Khi cần đơn giản hơn QuickSort'],
    visualize(raw) {
      const arr = parseArrayInput(raw);
      const steps = []; const a = [...arr]; const n = a.length;
      steps.push({ array: [...a], highlights: {}, description: 'Mảng ban đầu' });
      for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap/2)) {
        steps.push({ array: [...a], highlights: {}, description: `Gap = ${gap}` });
        for (let i = gap; i < n; i++) {
          const temp = a[i]; let j = i;
          while (j >= gap && a[j - gap] > temp) {
            steps.push({ array: [...a], highlights: { comparing: [j, j-gap] }, description: `So sánh a[${j}]=${a[j]} với a[${j-gap}]=${a[j-gap]}` });
            a[j] = a[j - gap]; j -= gap;
          }
          a[j] = temp;
          steps.push({ array: [...a], highlights: { found: [j] }, description: `Đặt ${temp} vào vị trí ${j}` });
        }
      }
      steps.push({ array: [...a], highlights: { sorted: Array.from({length:n},(_,i)=>i) }, description: 'Hoàn tất sắp xếp!' });
      return steps;
    },
    render: sortVizRender,
    code: {
      javascript: `function shellSort(arr) {
  const n = arr.length;
  // Bắt đầu với gap lớn, giảm dần
  for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap/2)) {
    // Insertion sort với khoảng cách gap
    for (let i = gap; i < n; i++) {
      let temp = arr[i], j = i;
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
  }
  return arr;
}`,
      go: `func shellSort(arr []int) {
    n := len(arr)
    // Bắt đầu với gap lớn, giảm dần
    for gap := n / 2; gap > 0; gap /= 2 {
        // Insertion sort với khoảng cách gap
        for i := gap; i < n; i++ {
            temp, j := arr[i], i
            for j >= gap && arr[j-gap] > temp {
                arr[j] = arr[j-gap]
                j -= gap
            }
            arr[j] = temp
        }
    }
}`,
      csharp: `public static void ShellSort(int[] arr) {
    int n = arr.Length;
    // Bắt đầu với gap lớn, giảm dần
    for (int gap = n / 2; gap > 0; gap /= 2) {
        // Insertion sort với khoảng cách gap
        for (int i = gap; i < n; i++) {
            int temp = arr[i], j = i;
            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
    }
}`
    }
  };

  /* ===== 12. CYCLE SORT ===== */
  R['cycle-sort'] = {
    name: 'Cycle Sort',
    group: 'sorting',
    defaultInput: '20, 40, 50, 10, 30, 60',
    description: 'Cycle Sort dựa trên ý tưởng phân hoạch thành các chu trình (cycles). Với mỗi phần tử, đếm số phần tử nhỏ hơn nó để xác định vị trí đúng, rồi thực hiện rotation trong chu trình. Tối thiểu số lần ghi (writes).',
    complexity: { timeBest: 'O(n²)', timeAvg: 'O(n²)', timeWorst: 'O(n²)', space: 'O(1)' },
    pros: ['Số lần ghi tối thiểu', 'In-place', 'Tối ưu cho bộ nhớ Flash/EEPROM'],
    cons: ['Luôn O(n²)', 'Không stable', 'Chậm'],
    useCases: ['Khi chi phí ghi rất cao', 'Bộ nhớ Flash', 'Đếm số ghi tối thiểu'],
    visualize(raw) {
      const arr = parseArrayInput(raw);
      const steps = []; const a = [...arr]; const n = a.length;
      steps.push({ array: [...a], highlights: {}, description: 'Mảng ban đầu' });
      for (let cs = 0; cs < n - 1; cs++) {
        let item = a[cs], pos = cs;
        for (let i = cs + 1; i < n; i++) { if (a[i] < item) pos++; }
        if (pos === cs) continue;
        while (item === a[pos]) pos++;
        if (pos !== cs) {
          [a[pos], item] = [item, a[pos]];
          steps.push({ array: [...a], highlights: { swapping: [pos] }, description: `Đặt ${a[pos]} vào vị trí ${pos}` });
        }
        while (pos !== cs) {
          pos = cs;
          for (let i = cs + 1; i < n; i++) { if (a[i] < item) pos++; }
          while (item === a[pos]) pos++;
          if (item !== a[pos]) {
            [a[pos], item] = [item, a[pos]];
            steps.push({ array: [...a], highlights: { swapping: [pos] }, description: `Cycle: đặt ${a[pos]} vào vị trí ${pos}` });
          }
        }
      }
      steps.push({ array: [...a], highlights: { sorted: Array.from({length:n},(_,i)=>i) }, description: 'Hoàn tất sắp xếp!' });
      return steps;
    },
    render: sortVizRender,
    code: {
      javascript: `function cycleSort(arr) {
  const n = arr.length;
  for (let cs = 0; cs < n - 1; cs++) {
    let item = arr[cs], pos = cs;
    // Đếm phần tử nhỏ hơn item
    for (let i = cs + 1; i < n; i++) if (arr[i] < item) pos++;
    if (pos === cs) continue;
    while (item === arr[pos]) pos++;
    [arr[pos], item] = [item, arr[pos]]; // Đặt vào đúng vị trí
    // Rotate phần còn lại của cycle
    while (pos !== cs) {
      pos = cs;
      for (let i = cs + 1; i < n; i++) if (arr[i] < item) pos++;
      while (item === arr[pos]) pos++;
      if (item !== arr[pos]) [arr[pos], item] = [item, arr[pos]];
    }
  }
  return arr;
}`,
      go: `func cycleSort(arr []int) {
    n := len(arr)
    for cs := 0; cs < n-1; cs++ {
        item, pos := arr[cs], cs
        for i := cs + 1; i < n; i++ { if arr[i] < item { pos++ } }
        if pos == cs { continue }
        for item == arr[pos] { pos++ }
        arr[pos], item = item, arr[pos]
        for pos != cs {
            pos = cs
            for i := cs + 1; i < n; i++ { if arr[i] < item { pos++ } }
            for item == arr[pos] { pos++ }
            if item != arr[pos] { arr[pos], item = item, arr[pos] }
        }
    }
}`,
      csharp: `public static void CycleSort(int[] arr) {
    int n = arr.Length;
    for (int cs = 0; cs < n - 1; cs++) {
        int item = arr[cs], pos = cs;
        for (int i = cs + 1; i < n; i++) if (arr[i] < item) pos++;
        if (pos == cs) continue;
        while (item == arr[pos]) pos++;
        (arr[pos], item) = (item, arr[pos]);
        while (pos != cs) {
            pos = cs;
            for (int i = cs + 1; i < n; i++) if (arr[i] < item) pos++;
            while (item == arr[pos]) pos++;
            if (item != arr[pos]) (arr[pos], item) = (item, arr[pos]);
        }
    }
}`
    }
  };

  /* ===== 13. INTRO SORT ===== */
  R['intro-sort'] = {
    name: 'Intro Sort',
    group: 'sorting',
    defaultInput: '45, 23, 11, 89, 77, 98, 4, 28, 65, 43',
    description: 'Intro Sort (Introspective Sort) kết hợp QuickSort, HeapSort và Insertion Sort. Bắt đầu bằng QuickSort, nếu đệ quy quá sâu (> 2*log(n)) thì chuyển sang HeapSort, và dùng Insertion Sort cho mảng nhỏ (≤16). Đây là thuật toán trong C++ STL.',
    complexity: { timeBest: 'O(n log n)', timeAvg: 'O(n log n)', timeWorst: 'O(n log n)', space: 'O(log n)' },
    pros: ['O(n log n) đảm bảo', 'Nhanh trong thực tế', 'Dùng trong C++ STL'],
    cons: ['Cài đặt phức tạp', 'Không stable', 'Overhead chuyển đổi chiến lược'],
    useCases: ['C++ std::sort', 'Cần sort nhanh với worst case đảm bảo', 'Production code'],
    visualize(raw) {
      const arr = parseArrayInput(raw);
      const steps = []; const a = [...arr]; const n = a.length;
      const maxDepth = 2 * Math.floor(Math.log2(n));
      steps.push({ array: [...a], highlights: {}, description: `Mảng ban đầu, max depth = ${maxDepth}` });
      function insertSort(a, lo, hi) {
        for (let i = lo+1; i <= hi; i++) {
          const key = a[i]; let j = i-1;
          while(j >= lo && a[j] > key) { a[j+1] = a[j]; j--; }
          a[j+1] = key;
        }
        steps.push({ array: [...a], highlights: { found: Array.from({length:hi-lo+1},(_,x)=>lo+x) }, description: `Insertion sort [${lo}..${hi}]` });
      }
      function heapSortRange(a, lo, hi) {
        const sub = a.slice(lo, hi+1);
        sub.sort((x,y)=>x-y);
        for (let i = lo; i <= hi; i++) a[i] = sub[i-lo];
        steps.push({ array: [...a], highlights: { active: Array.from({length:hi-lo+1},(_,x)=>lo+x) }, description: `HeapSort fallback [${lo}..${hi}]` });
      }
      function introSort(a, lo, hi, depth) {
        if (hi - lo < 16) { insertSort(a, lo, hi); return; }
        if (depth === 0) { heapSortRange(a, lo, hi); return; }
        const pivot = a[hi]; let i = lo - 1;
        for (let j = lo; j < hi; j++) { if (a[j] < pivot) { i++; [a[i], a[j]] = [a[j], a[i]]; } }
        [a[i+1], a[hi]] = [a[hi], a[i+1]];
        const p = i+1;
        steps.push({ array: [...a], highlights: { pivot: p, active: Array.from({length:hi-lo+1},(_,x)=>lo+x) }, description: `QuickSort partition, pivot=${pivot} tại ${p}` });
        introSort(a, lo, p-1, depth-1);
        introSort(a, p+1, hi, depth-1);
      }
      introSort(a, 0, n-1, maxDepth);
      steps.push({ array: [...a], highlights: { sorted: Array.from({length:n},(_,i)=>i) }, description: 'Hoàn tất sắp xếp!' });
      return steps;
    },
    render: sortVizRender,
    code: {
      javascript: `function introSort(arr) {
  const maxDepth = 2 * Math.floor(Math.log2(arr.length));
  introSortHelper(arr, 0, arr.length - 1, maxDepth);
}
function introSortHelper(arr, lo, hi, depth) {
  if (hi - lo < 16) {
    // Mảng nhỏ → Insertion Sort
    for (let i = lo+1; i <= hi; i++) {
      let key = arr[i], j = i-1;
      while (j >= lo && arr[j] > key) { arr[j+1] = arr[j]; j--; }
      arr[j+1] = key;
    }
    return;
  }
  if (depth === 0) {
    // Đệ quy quá sâu → Heap Sort
    heapSortRange(arr, lo, hi);
    return;
  }
  // QuickSort partition
  let pivot = arr[hi], i = lo - 1;
  for (let j = lo; j < hi; j++) {
    if (arr[j] < pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]]; }
  }
  [arr[i+1], arr[hi]] = [arr[hi], arr[i+1]];
  introSortHelper(arr, lo, i, depth - 1);
  introSortHelper(arr, i + 2, hi, depth - 1);
}`,
      go: `func introSort(arr []int) {
    maxDepth := 2 * int(math.Log2(float64(len(arr))))
    introSortHelper(arr, 0, len(arr)-1, maxDepth)
}
func introSortHelper(arr []int, lo, hi, depth int) {
    if hi-lo < 16 {
        // Mảng nhỏ → Insertion Sort
        for i := lo + 1; i <= hi; i++ {
            key, j := arr[i], i-1
            for j >= lo && arr[j] > key { arr[j+1] = arr[j]; j-- }
            arr[j+1] = key
        }
        return
    }
    if depth == 0 {
        // Đệ quy quá sâu → Heap Sort
        sort.Ints(arr[lo : hi+1])
        return
    }
    pivot, i := arr[hi], lo-1
    for j := lo; j < hi; j++ {
        if arr[j] < pivot { i++; arr[i], arr[j] = arr[j], arr[i] }
    }
    arr[i+1], arr[hi] = arr[hi], arr[i+1]
    introSortHelper(arr, lo, i, depth-1)
    introSortHelper(arr, i+2, hi, depth-1)
}`,
      csharp: `public static void IntroSort(int[] arr) {
    int maxDepth = 2 * (int)Math.Log2(arr.Length);
    IntroSortHelper(arr, 0, arr.Length - 1, maxDepth);
}
static void IntroSortHelper(int[] arr, int lo, int hi, int depth) {
    if (hi - lo < 16) {
        // Mảng nhỏ → Insertion Sort
        for (int i = lo+1; i <= hi; i++) {
            int key = arr[i], j = i-1;
            while (j >= lo && arr[j] > key) { arr[j+1] = arr[j]; j--; }
            arr[j+1] = key;
        }
        return;
    }
    if (depth == 0) {
        // Đệ quy quá sâu → Heap Sort
        Array.Sort(arr, lo, hi - lo + 1);
        return;
    }
    int pivot = arr[hi]; int ii = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (arr[j] < pivot) { ii++; (arr[ii], arr[j]) = (arr[j], arr[ii]); }
    }
    (arr[ii+1], arr[hi]) = (arr[hi], arr[ii+1]);
    IntroSortHelper(arr, lo, ii, depth - 1);
    IntroSortHelper(arr, ii + 2, hi, depth - 1);
}`
    }
  };

})();

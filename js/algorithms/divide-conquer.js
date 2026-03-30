/* divide-conquer.js — 5 Divide & Conquer Algorithms */
(function(){
const R = window.AlgoRegistry;
function dcRender(canvas,step){renderArrayBars(canvas,step.array,step.highlights);}

R['dc-merge-sort']={name:'Merge Sort (D&C)',group:'divide-conquer',defaultInput:'38, 27, 43, 3, 9, 82, 10',
  description:'Merge Sort minh họa chia để trị: chia mảng thành 2 nửa, đệ quy sắp xếp mỗi nửa, rồi trộn lại. Mỗi bước chia giảm kích thước bài toán đi một nửa.',
  complexity:{timeBest:'O(n log n)',timeAvg:'O(n log n)',timeWorst:'O(n log n)',space:'O(n)'},
  pros:['Minh họa D&C rõ ràng','O(n log n) đảm bảo','Stable'],cons:['O(n) bộ nhớ phụ'],
  useCases:['External sorting','Stable sort','Parallel computing'],
  visualize(raw){const arr=parseArrayInput(raw);const steps=[];const a=[...arr];
    steps.push({array:[...a],highlights:{},description:'Merge Sort — Chia để trị'});
    function ms(a,l,r){if(l>=r)return;const m=Math.floor((l+r)/2);
      steps.push({array:[...a],highlights:{active:Array.from({length:r-l+1},(_,x)=>l+x)},description:`Chia [${l}..${r}] tại mid=${m}`});
      ms(a,l,m);ms(a,m+1,r);
      const L=a.slice(l,m+1),Ri=a.slice(m+1,r+1);let i=0,j=0,k=l;
      while(i<L.length&&j<Ri.length){if(L[i]<=Ri[j])a[k++]=L[i++];else a[k++]=Ri[j++];}
      while(i<L.length)a[k++]=L[i++];while(j<Ri.length)a[k++]=Ri[j++];
      steps.push({array:[...a],highlights:{found:Array.from({length:r-l+1},(_,x)=>l+x)},description:`Trộn [${l}..${r}]`});}
    ms(a,0,a.length-1);
    steps.push({array:[...a],highlights:{sorted:Array.from({length:a.length},(_,i)=>i)},description:'Hoàn tất!'});return steps;},
  render:dcRender,
  code:{javascript:`// Xem Merge Sort trong phần Sorting`,go:`// Xem Merge Sort trong phần Sorting`,csharp:`// Xem Merge Sort trong phần Sorting`}
};

R['quick-select']={name:'Quick Sort / Quick Select',group:'divide-conquer',defaultInput:'3, 2, 1, 5, 6, 4 | 2',
  description:'Quick Select tìm phần tử nhỏ thứ k trong mảng không sắp xếp, dựa trên partition của QuickSort. Trung bình O(n), chỉ cần xử lý một nửa sau partition thay vì cả hai.',
  complexity:{timeBest:'O(n)',timeAvg:'O(n)',timeWorst:'O(n²)',space:'O(1)'},
  pros:['O(n) trung bình','In-place','Không cần sắp xếp toàn bộ'],cons:['Worst case O(n²)','Không stable'],
  useCases:['Tìm median','Kth largest element','Order statistics'],
  visualize(raw){const parts=raw.split('|');const arr=parseArrayInput(parts[0]);const k=parseInt((parts[1]||'2').trim())||2;
    const steps=[];const a=[...arr];
    steps.push({array:[...a],highlights:{},description:`Quick Select: tìm phần tử nhỏ thứ ${k}`});
    function partition(a,lo,hi){const p=a[hi];let i=lo-1;
      for(let j=lo;j<hi;j++){if(a[j]<=p){i++;[a[i],a[j]]=[a[j],a[i]];}}
      [a[i+1],a[hi]]=[a[hi],a[i+1]];return i+1;}
    let lo=0,hi=a.length-1,target=k-1;
    while(lo<=hi){const p=partition(a,lo,hi);
      steps.push({array:[...a],highlights:{pivot:p,active:Array.from({length:hi-lo+1},(_,x)=>lo+x)},description:`Partition: pivot tại ${p}, giá trị=${a[p]}`});
      if(p===target){steps.push({array:[...a],highlights:{found:[p]},description:`✅ Phần tử thứ ${k} = ${a[p]}`});break;}
      if(p<target)lo=p+1;else hi=p-1;}
    return steps;},
  render:dcRender,
  code:{javascript:`function quickSelect(arr, k) {
  let lo = 0, hi = arr.length - 1;
  k--; // 0-indexed
  while (lo <= hi) {
    const p = partition(arr, lo, hi);
    if (p === k) return arr[p];       // Tìm thấy
    if (p < k) lo = p + 1;            // Tìm bên phải
    else hi = p - 1;                   // Tìm bên trái
  }
}
function partition(arr, lo, hi) {
  const pivot = arr[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    if (arr[j] <= pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]]; }
  }
  [arr[i+1], arr[hi]] = [arr[hi], arr[i+1]];
  return i + 1;
}`,go:`func quickSelect(arr []int, k int) int {
    lo, hi := 0, len(arr)-1
    k--
    for lo <= hi {
        p := partition(arr, lo, hi)
        if p == k { return arr[p] }
        if p < k { lo = p + 1 } else { hi = p - 1 }
    }
    return -1
}`,csharp:`public static int QuickSelect(int[] arr, int k) {
    int lo = 0, hi = arr.Length - 1;
    k--;
    while (lo <= hi) {
        int p = Partition(arr, lo, hi);
        if (p == k) return arr[p];
        if (p < k) lo = p + 1; else hi = p - 1;
    }
    return -1;
}`}
};

R['binary-search-dc']={name:'Binary Search (D&C variants)',group:'divide-conquer',defaultInput:'1, 3, 5, 7, 9, 11, 13, 15 | 7',
  description:'Binary Search là ví dụ kinh điển của chia để trị: chia không gian tìm kiếm thành 2, chọn nửa phù hợp. Các biến thể: tìm vị trí chèn, lower/upper bound, tìm trong mảng xoay.',
  complexity:{timeBest:'O(1)',timeAvg:'O(log n)',timeWorst:'O(log n)',space:'O(1)'},
  pros:['O(log n)','Nhiều biến thể hữu ích','Nền tảng D&C'],cons:['Cần mảng sắp xếp'],
  useCases:['Lower/upper bound','Search in rotated array','Peak finding'],
  visualize(raw){const parts=raw.split('|');const arr=parseArrayInput(parts[0]).sort((a,b)=>a-b);const target=parseInt((parts[1]||'7').trim())||7;
    const steps=[];let lo=0,hi=arr.length-1;
    steps.push({array:arr,highlights:{},description:`Binary Search D&C: tìm ${target}`});
    while(lo<=hi){const mid=Math.floor((lo+hi)/2);
      steps.push({array:arr,highlights:{active:[mid],comparing:[lo,hi]},description:`Chia: [${lo}..${hi}], mid=${mid}, a[mid]=${arr[mid]}`});
      if(arr[mid]===target){steps.push({array:arr,highlights:{found:[mid]},description:`✅ Tìm thấy tại ${mid}`});return steps;}
      if(arr[mid]<target)lo=mid+1;else hi=mid-1;}
    steps.push({array:arr,highlights:{},description:`❌ Không tìm thấy ${target}`});return steps;},
  render:dcRender,
  code:{javascript:`// Lower bound: tìm vị trí đầu tiên >= target
function lowerBound(arr, target) {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
// Upper bound: tìm vị trí đầu tiên > target
function upperBound(arr, target) {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,go:`func lowerBound(arr []int, target int) int {
    lo, hi := 0, len(arr)
    for lo < hi {
        mid := (lo + hi) / 2
        if arr[mid] < target { lo = mid + 1 } else { hi = mid }
    }
    return lo
}`,csharp:`public static int LowerBound(int[] arr, int target) {
    int lo = 0, hi = arr.Length;
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (arr[mid] < target) lo = mid + 1; else hi = mid;
    }
    return lo;
}`}
};

R['strassen-matrix']={name:'Strassen Matrix Multiplication',group:'divide-conquer',defaultInput:'1, 2, 3, 4, 5, 6, 7, 8',
  description:'Strassen giảm nhân ma trận từ O(n³) xuống O(n^2.807) bằng cách chia ma trận thành 4 sub-matrices và dùng 7 phép nhân thay vì 8. Chia để trị trên ma trận.',
  complexity:{timeBest:'O(n^2.807)',timeAvg:'O(n^2.807)',timeWorst:'O(n^2.807)',space:'O(n²)'},
  pros:['Nhanh hơn O(n³) cho ma trận lớn','Ý tưởng đẹp'],cons:['Overhead cho ma trận nhỏ','Numerical instability','Phức tạp cài đặt'],
  useCases:['Ma trận lớn','Scientific computing','Lý thuyết thuật toán'],
  visualize(raw){const arr=parseArrayInput(raw);const n=Math.floor(Math.sqrt(arr.length));const steps=[];
    steps.push({array:arr.slice(0,n*n),highlights:{},description:`Ma trận ${n}x${n} — Strassen chia thành 4 phần`});
    steps.push({array:arr.slice(0,n*n),highlights:{active:Array.from({length:Math.floor(n*n/4)},(_,i)=>i)},description:'Phần tử trên-trái (A11)'});
    steps.push({array:arr.slice(0,n*n),highlights:{comparing:Array.from({length:Math.floor(n*n/4)},(_,i)=>i+Math.floor(n*n/4))},description:'7 phép nhân thay vì 8 → O(n^2.807)'});
    steps.push({array:arr.slice(0,n*n),highlights:{sorted:Array.from({length:n*n},(_,i)=>i)},description:'Kết hợp kết quả'});return steps;},
  render:dcRender,
  code:{javascript:`function strassenMultiply(A, B, n) {
  if (n === 1) return [[A[0][0] * B[0][0]]];
  const half = n / 2;
  // Chia thành 4 sub-matrices
  const [A11,A12,A21,A22] = split(A, half);
  const [B11,B12,B21,B22] = split(B, half);
  // 7 phép nhân (thay vì 8)
  const M1 = strassenMultiply(add(A11,A22), add(B11,B22), half);
  const M2 = strassenMultiply(add(A21,A22), B11, half);
  const M3 = strassenMultiply(A11, sub(B12,B22), half);
  const M4 = strassenMultiply(A22, sub(B21,B11), half);
  const M5 = strassenMultiply(add(A11,A12), B22, half);
  const M6 = strassenMultiply(sub(A21,A11), add(B11,B12), half);
  const M7 = strassenMultiply(sub(A12,A22), add(B21,B22), half);
  // Kết hợp
  const C11 = add(sub(add(M1,M4),M5),M7);
  const C12 = add(M3, M5);
  const C21 = add(M2, M4);
  const C22 = add(sub(add(M1,M3),M2),M6);
  return combine(C11,C12,C21,C22);
}`,go:`// Strassen Matrix Multiply - Go implementation
func strassen(A, B [][]int, n int) [][]int {
    if n == 1 { return [][]int{{A[0][0] * B[0][0]}} }
    half := n / 2
    A11, A12, A21, A22 := split(A, half)
    B11, B12, B21, B22 := split(B, half)
    // 7 phép nhân thay vì 8
    M1 := strassen(add(A11,A22), add(B11,B22), half)
    M2 := strassen(add(A21,A22), B11, half)
    M3 := strassen(A11, sub(B12,B22), half)
    M4 := strassen(A22, sub(B21,B11), half)
    M5 := strassen(add(A11,A12), B22, half)
    M6 := strassen(sub(A21,A11), add(B11,B12), half)
    M7 := strassen(sub(A12,A22), add(B21,B22), half)
    return combine(
        add(sub(add(M1,M4),M5),M7), add(M3,M5),
        add(M2,M4), add(sub(add(M1,M3),M2),M6))
}`,csharp:`// Strassen Matrix Multiply
public static int[,] Strassen(int[,] A, int[,] B, int n) {
    if (n == 1) return new int[,]{{A[0,0] * B[0,0]}};
    int half = n / 2;
    // Chia, 7 phép nhân, kết hợp
    // (Tương tự logic JavaScript ở trên)
    var (A11,A12,A21,A22) = Split(A, half);
    var (B11,B12,B21,B22) = Split(B, half);
    var M1 = Strassen(Add(A11,A22), Add(B11,B22), half);
    // ... M2-M7 tương tự
    return Combine(C11, C12, C21, C22);
}`}
};

R['karatsuba']={name:'Karatsuba Multiplication',group:'divide-conquer',defaultInput:'1234, 5678',
  description:'Karatsuba nhân hai số lớn trong O(n^1.585) thay vì O(n²). Chia mỗi số thành 2 nửa, dùng 3 phép nhân thay vì 4, rồi kết hợp bằng cộng và dịch.',
  complexity:{timeBest:'O(n^1.585)',timeAvg:'O(n^1.585)',timeWorst:'O(n^1.585)',space:'O(n)'},
  pros:['Nhanh hơn O(n²)','Ý tưởng đẹp','Nền tảng cho FFT'],cons:['Overhead cho số nhỏ','Recursive'],
  useCases:['Big integer multiplication','Cryptography','Polynomial multiplication'],
  visualize(raw){const parts=raw.split(',').map(s=>parseInt(s.trim()));const x=parts[0]||1234,y=parts[1]||5678;
    const steps=[];steps.push({array:[x,y],highlights:{},description:`Karatsuba: ${x} × ${y}`});
    const n=Math.max(String(x).length,String(y).length);const half=Math.ceil(n/2);const p=Math.pow(10,half);
    const a=Math.floor(x/p),b=x%p,c=Math.floor(y/p),d=y%p;
    steps.push({array:[a,b,c,d],highlights:{active:[0,1]},description:`x=${a}·10^${half}+${b}, y=${c}·10^${half}+${d}`});
    const ac=a*c,bd=b*d,abcd=(a+b)*(c+d);
    steps.push({array:[ac,bd,abcd],highlights:{comparing:[0,1,2]},description:`ac=${ac}, bd=${bd}, (a+b)(c+d)=${abcd}`});
    const result=ac*p*p+(abcd-ac-bd)*p+bd;
    steps.push({array:[result],highlights:{found:[0]},description:`Kết quả: ${x} × ${y} = ${result}`});return steps;},
  render:dcRender,
  code:{javascript:`function karatsuba(x, y) {
  if (x < 10 || y < 10) return x * y;
  const n = Math.max(String(x).length, String(y).length);
  const half = Math.ceil(n / 2);
  const p = Math.pow(10, half);
  // Chia thành 2 nửa
  const a = Math.floor(x / p), b = x % p;
  const c = Math.floor(y / p), d = y % p;
  // 3 phép nhân thay vì 4
  const ac = karatsuba(a, c);
  const bd = karatsuba(b, d);
  const abcd = karatsuba(a + b, c + d);
  // Kết hợp: ac·10^(2·half) + (abcd-ac-bd)·10^half + bd
  return ac * p * p + (abcd - ac - bd) * p + bd;
}`,go:`func karatsuba(x, y int64) int64 {
    if x < 10 || y < 10 { return x * y }
    n := len(fmt.Sprintf("%d", max(x, y)))
    half := (n + 1) / 2
    p := int64(math.Pow10(half))
    a, b := x/p, x%p
    c, d := y/p, y%p
    ac := karatsuba(a, c)
    bd := karatsuba(b, d)
    abcd := karatsuba(a+b, c+d)
    return ac*p*p + (abcd-ac-bd)*p + bd
}`,csharp:`public static long Karatsuba(long x, long y) {
    if (x < 10 || y < 10) return x * y;
    int n = Math.Max(x.ToString().Length, y.ToString().Length);
    int half = (n + 1) / 2;
    long p = (long)Math.Pow(10, half);
    long a = x/p, b = x%p, c = y/p, d = y%p;
    long ac = Karatsuba(a, c);
    long bd = Karatsuba(b, d);
    long abcd = Karatsuba(a+b, c+d);
    return ac*p*p + (abcd-ac-bd)*p + bd;
}`}
};

})();

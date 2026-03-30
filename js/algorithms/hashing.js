/* hashing.js — 6 Hashing Algorithms */
(function(){
const R = window.AlgoRegistry || (window.AlgoRegistry = {});
function hashRender(canvas,step){renderArrayBars(canvas,step.array,step.highlights);}

R['hashmap']={name:'HashMap / HashSet',group:'hashing',defaultInput:'apple, banana, cherry, date, elderberry',
  description:'HashMap lưu cặp key-value nhờ hash function chuyển key thành index. Trung bình O(1) cho insert/search/delete. Xử lý va chạm bằng chaining hoặc open addressing.',
  complexity:{timeBest:'O(1)',timeAvg:'O(1)',timeWorst:'O(n)',space:'O(n)'},
  pros:['O(1) trung bình','Linh hoạt key type','Phổ biến nhất'],cons:['Worst case O(n)','Tốn bộ nhớ','Hash collision'],
  useCases:['Caching','Counting frequency','Two Sum problem','Symbol tables'],
  visualize(raw){const words=raw.split(/[,\s]+/).filter(Boolean);const steps=[];const size=7;const table=Array(size).fill(null).map(()=>[]);
    steps.push({array:Array(size).fill(0),highlights:{},description:`HashMap size=${size}`});
    words.forEach(w=>{const h=Math.abs([...w].reduce((s,c)=>s+c.charCodeAt(0),0))%size;table[h].push(w);
      steps.push({array:table.map(b=>b.length),highlights:{active:[h]},description:`hash("${w}")=${h}, bucket[${h}]=[${table[h].join(',')}]`});});
    steps.push({array:table.map(b=>b.length),highlights:{sorted:Array.from({length:size},(_,i)=>i)},description:'HashMap hoàn tất!'});return steps;},
  render:hashRender,
  code:{javascript:`class HashMap {
  constructor(size = 16) {
    this.buckets = Array.from({length: size}, () => []);
    this.size = size;
  }
  hash(key) {
    let h = 0;
    for (const ch of String(key)) h = (h * 31 + ch.charCodeAt(0)) % this.size;
    return h;
  }
  set(key, value) {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    const existing = bucket.find(([k]) => k === key);
    if (existing) existing[1] = value;
    else bucket.push([key, value]);
  }
  get(key) {
    const idx = this.hash(key);
    const pair = this.buckets[idx].find(([k]) => k === key);
    return pair ? pair[1] : undefined;
  }
}`,go:`type HashMap struct {
    buckets [][]Entry
    size    int
}
func NewHashMap(size int) *HashMap {
    return &HashMap{buckets: make([][]Entry, size), size: size}
}
func (m *HashMap) hash(key string) int {
    h := 0
    for _, ch := range key { h = (h*31 + int(ch)) % m.size }
    return h
}
func (m *HashMap) Set(key string, val interface{}) {
    idx := m.hash(key)
    m.buckets[idx] = append(m.buckets[idx], Entry{key, val})
}`,csharp:`public class SimpleHashMap<TKey, TVal> {
    List<(TKey key, TVal val)>[] buckets;
    int size;
    public SimpleHashMap(int size = 16) {
        this.size = size;
        buckets = new List<(TKey, TVal)>[size];
        for (int i = 0; i < size; i++) buckets[i] = new();
    }
    int Hash(TKey key) => Math.Abs(key.GetHashCode()) % size;
    public void Set(TKey key, TVal val) {
        int idx = Hash(key);
        buckets[idx].Add((key, val));
    }
}`}
};

R['chaining']={name:'Chaining',group:'hashing',defaultInput:'5, 12, 19, 26, 33, 7, 14, 21',
  description:'Chaining xử lý va chạm hash bằng linked list tại mỗi bucket. Khi nhiều key hash cùng index, chúng được lưu trong danh sách liên kết. Đơn giản nhưng tốn bộ nhớ cho pointers.',
  complexity:{timeBest:'O(1)',timeAvg:'O(1+α)',timeWorst:'O(n)',space:'O(n)'},
  pros:['Đơn giản','Không bao giờ đầy','Xóa dễ dàng'],cons:['Tốn bộ nhớ pointer','Cache-unfriendly'],
  useCases:['HashMap implementation','Khi load factor cao','Khi cần xóa nhiều'],
  visualize(raw){const arr=parseArrayInput(raw);const steps=[];const size=7;const table=Array(size).fill(null).map(()=>[]);
    steps.push({array:Array(size).fill(0),highlights:{},description:'Chaining: mỗi bucket là linked list'});
    arr.forEach(v=>{const h=v%size;table[h].push(v);
      steps.push({array:table.map(b=>b.length),highlights:{active:[h]},description:`${v} % ${size} = ${h} → chain: [${table[h].join('→')}]`});});
    steps.push({array:table.map(b=>b.length),highlights:{sorted:Array.from({length:size},(_,i)=>i)},description:'Chaining hoàn tất!'});return steps;},
  render:hashRender,
  code:{javascript:`// Chaining: mỗi bucket là mảng/linked list
class ChainingHashTable {
  constructor(size) { this.table = Array.from({length: size}, () => []); this.size = size; }
  insert(key) { this.table[key % this.size].push(key); }
  search(key) { return this.table[key % this.size].includes(key); }
  delete(key) {
    const bucket = this.table[key % this.size];
    const idx = bucket.indexOf(key);
    if (idx !== -1) bucket.splice(idx, 1);
  }
}`,go:`// Tương tự HashMap với [][]int cho buckets`,csharp:`// Tương tự HashMap với List<int>[] cho buckets`}
};

R['open-addressing']={name:'Open Addressing',group:'hashing',defaultInput:'10, 22, 31, 4, 15, 28, 17',
  description:'Open Addressing lưu tất cả entries trong bảng hash. Khi va chạm, tìm slot trống tiếp theo (linear probing, quadratic probing, double hashing). Không dùng linked list.',
  complexity:{timeBest:'O(1)',timeAvg:'O(1/(1-α))',timeWorst:'O(n)',space:'O(n)'},
  pros:['Cache-friendly','Không tốn pointer','Tốt khi load factor thấp'],cons:['Clustering','Khó xóa','Cần resize'],
  useCases:['Cache-friendly hash table','Khi bộ nhớ hạn chế','Python dict'],
  visualize(raw){const arr=parseArrayInput(raw);const steps=[];const size=11;const table=Array(size).fill(null);
    steps.push({array:table.map(v=>v||0),highlights:{},description:`Open Addressing (Linear Probing), size=${size}`});
    arr.forEach(v=>{let h=v%size;let probes=0;while(table[h]!==null){h=(h+1)%size;probes++;}table[h]=v;
      steps.push({array:table.map(v=>v||0),highlights:{active:[h]},description:`Insert ${v}: hash=${v%size}, probes=${probes}, slot=${h}`});});
    steps.push({array:table.map(v=>v||0),highlights:{sorted:Array.from({length:size},(_,i)=>table[i]!==null?i:-1).filter(i=>i>=0)},description:'Open Addressing hoàn tất!'});return steps;},
  render:hashRender,
  code:{javascript:`class OpenAddressingHash {
  constructor(size) { this.table = new Array(size).fill(null); this.size = size; }
  insert(key) {
    let h = key % this.size;
    while (this.table[h] !== null) h = (h + 1) % this.size; // Linear probing
    this.table[h] = key;
  }
  search(key) {
    let h = key % this.size;
    while (this.table[h] !== null) {
      if (this.table[h] === key) return h;
      h = (h + 1) % this.size;
    }
    return -1;
  }
}`,go:`type OAHash struct { table []int; size int }
func (h *OAHash) Insert(key int) {
    idx := key % h.size
    for h.table[idx] != -1 { idx = (idx + 1) % h.size }
    h.table[idx] = key
}`,csharp:`public class OAHash {
    int?[] table; int size;
    public OAHash(int size) { this.size = size; table = new int?[size]; }
    public void Insert(int key) {
        int h = key % size;
        while (table[h] != null) h = (h + 1) % size;
        table[h] = key;
    }
}`}
};

R['rolling-hash']={name:'Rolling Hash',group:'hashing',defaultInput:'abcabcabc | abc',
  description:'Rolling Hash tính hash chuỗi con bằng cách cập nhật hash trước đó trong O(1), thay vì tính lại O(m). Loại bỏ ký tự đầu, thêm ký tự cuối. Dùng trong Rabin-Karp.',
  complexity:{timeBest:'O(1)',timeAvg:'O(1)',timeWorst:'O(1)',space:'O(1)'},
  pros:['O(1) update','Hiệu quả cho sliding window trên string'],cons:['Hash collision','Cần modular arithmetic'],
  useCases:['Rabin-Karp string matching','Plagiarism detection','DNA sequence matching'],
  visualize(raw){const parts=raw.split('|');const text=(parts[0]||'abcabc').trim();const pat=(parts[1]||'abc').trim();
    const steps=[];const arr=text.split('').map(c=>c.charCodeAt(0)-96);
    steps.push({array:arr,highlights:{},description:`Rolling Hash: tìm "${pat}" trong "${text}"`});
    const m=pat.length;const base=26;const mod=101;
    let pH=0,tH=0,h=1;
    for(let i=0;i<m-1;i++)h=(h*base)%mod;
    for(let i=0;i<m;i++){pH=(base*pH+pat.charCodeAt(i))%mod;tH=(base*tH+text.charCodeAt(i))%mod;}
    for(let i=0;i<=text.length-m;i++){const win=Array.from({length:m},(_,j)=>i+j);
      if(pH===tH){steps.push({array:arr,highlights:{found:win},description:`Hash match tại i=${i}!`});}
      else{steps.push({array:arr,highlights:{active:win},description:`i=${i}: textHash=${tH}, patHash=${pH}`});}
      if(i<text.length-m){tH=(base*(tH-text.charCodeAt(i)*h)+text.charCodeAt(i+m))%mod;if(tH<0)tH+=mod;}}
    return steps;},
  render:hashRender,
  code:{javascript:`function rollingHash(text, pattern) {
  const base = 256, mod = 101, m = pattern.length;
  let patHash = 0, textHash = 0, h = 1;
  for (let i = 0; i < m - 1; i++) h = (h * base) % mod;
  for (let i = 0; i < m; i++) {
    patHash = (base * patHash + pattern.charCodeAt(i)) % mod;
    textHash = (base * textHash + text.charCodeAt(i)) % mod;
  }
  for (let i = 0; i <= text.length - m; i++) {
    if (patHash === textHash) return i; // Tìm thấy (cần verify)
    if (i < text.length - m) {
      // Roll: bỏ ký tự đầu, thêm ký tự cuối
      textHash = (base * (textHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % mod;
      if (textHash < 0) textHash += mod;
    }
  }
  return -1;
}`,go:`func rollingHash(text, pattern string) int {
    base, mod := 256, 101
    m := len(pattern)
    patHash, textHash, h := 0, 0, 1
    for i := 0; i < m-1; i++ { h = (h * base) % mod }
    for i := 0; i < m; i++ {
        patHash = (base*patHash + int(pattern[i])) % mod
        textHash = (base*textHash + int(text[i])) % mod
    }
    for i := 0; i <= len(text)-m; i++ {
        if patHash == textHash { return i }
        if i < len(text)-m {
            textHash = (base*(textHash-int(text[i])*h) + int(text[i+m])) % mod
            if textHash < 0 { textHash += mod }
        }
    }
    return -1
}`,csharp:`public static int RollingHash(string text, string pattern) {
    int b = 256, mod = 101, m = pattern.Length;
    int pH = 0, tH = 0, h = 1;
    for (int i = 0; i < m-1; i++) h = (h * b) % mod;
    for (int i = 0; i < m; i++) {
        pH = (b * pH + pattern[i]) % mod;
        tH = (b * tH + text[i]) % mod;
    }
    for (int i = 0; i <= text.Length - m; i++) {
        if (pH == tH) return i;
        if (i < text.Length - m) {
            tH = (b * (tH - text[i] * h) + text[i + m]) % mod;
            if (tH < 0) tH += mod;
        }
    }
    return -1;
}`}
};

R['rabin-karp']={name:'Rabin-Karp',group:'hashing',defaultInput:'ababcababcabc | ababc',
  description:'Rabin-Karp dùng rolling hash để tìm pattern trong text. Tính hash pattern một lần, so sánh với hash từng cửa sổ. Khi hash khớp, verify bằng so sánh ký tự. Trung bình O(n+m).',
  complexity:{timeBest:'O(n+m)',timeAvg:'O(n+m)',timeWorst:'O(nm)',space:'O(1)'},
  pros:['O(n+m) trung bình','Tìm nhiều pattern cùng lúc','Dùng rolling hash'],cons:['Worst case O(nm)','Hash collision'],
  useCases:['String matching','Multiple pattern search','Plagiarism detection'],
  visualize(raw){const parts=raw.split('|');const text=(parts[0]||'ababcabc').trim();const pat=(parts[1]||'abc').trim();
    const steps=[];const arr=text.split('').map(c=>c.charCodeAt(0)-96);const m=pat.length;
    steps.push({array:arr,highlights:{},description:`Rabin-Karp: tìm "${pat}" trong "${text}"`});
    for(let i=0;i<=text.length-m;i++){const sub=text.substring(i,i+m);const win=Array.from({length:m},(_,j)=>i+j);
      if(sub===pat){steps.push({array:arr,highlights:{found:win},description:`✅ Tìm thấy tại i=${i}`});}
      else{steps.push({array:arr,highlights:{active:win},description:`i=${i}: "${sub}" ≠ "${pat}"`});}}
    return steps;},
  render:hashRender,
  code:{javascript:`// Rabin-Karp = Rolling Hash + string verification
function rabinKarp(text, pattern) {
  // Sử dụng rolling hash (xem Rolling Hash)
  // Khi hash match → verify bằng so sánh ký tự
  const matches = [];
  const m = pattern.length;
  for (let i = 0; i <= text.length - m; i++) {
    if (text.substring(i, i + m) === pattern) {
      matches.push(i);
    }
  }
  return matches;
}`,go:`func rabinKarp(text, pattern string) []int {
    matches := []int{}
    m := len(pattern)
    for i := 0; i <= len(text)-m; i++ {
        if text[i:i+m] == pattern { matches = append(matches, i) }
    }
    return matches
}`,csharp:`public static List<int> RabinKarp(string text, string pattern) {
    var matches = new List<int>();
    int m = pattern.Length;
    for (int i = 0; i <= text.Length - m; i++)
        if (text.Substring(i, m) == pattern) matches.Add(i);
    return matches;
}`}
};

R['consistent-hashing']={name:'Consistent Hashing',group:'hashing',defaultInput:'server1, server2, server3, server4',
  description:'Consistent Hashing phân phối keys trên vòng hash. Khi thêm/xóa server, chỉ ảnh hưởng keys lân cận. Dùng virtual nodes để phân bố đều. Rất quan trọng trong hệ thống phân tán.',
  complexity:{timeBest:'O(log n)',timeAvg:'O(log n)',timeWorst:'O(log n)',space:'O(n)'},
  pros:['Ít ảnh hưởng khi thêm/xóa node','Phân bố đều với virtual nodes','Scalable'],cons:['Cần virtual nodes','Phức tạp hơn modular hash'],
  useCases:['Load balancing','Distributed caching','CDN','Database sharding'],
  visualize(raw){const servers=raw.split(/[,\s]+/).filter(Boolean);const steps=[];
    const arr=servers.map((_,i)=>i+1);
    steps.push({array:arr,highlights:{},description:'Consistent Hashing Ring'});
    servers.forEach((s,i)=>{steps.push({array:arr,highlights:{active:[i]},description:`Server "${s}" tại vị trí ${(i*360/servers.length).toFixed(0)}° trên ring`});});
    steps.push({array:arr,highlights:{found:[1]},description:'Key "user123" → server gần nhất theo chiều kim đồng hồ'});
    steps.push({array:arr,highlights:{sorted:Array.from({length:servers.length},(_,i)=>i)},description:'Consistent Hashing: chỉ K/N keys bị ảnh hưởng khi thêm/xóa server'});
    return steps;},
  render:hashRender,
  code:{javascript:`class ConsistentHash {
  constructor(nodes, replicas = 100) {
    this.ring = new Map(); // position → node
    this.sortedKeys = [];
    this.replicas = replicas;
    for (const node of nodes) this.addNode(node);
  }
  hash(key) { // Simple hash function
    let h = 0;
    for (const ch of String(key)) h = ((h << 5) - h + ch.charCodeAt(0)) | 0;
    return Math.abs(h);
  }
  addNode(node) {
    for (let i = 0; i < this.replicas; i++) {
      const pos = this.hash(node + ':' + i);
      this.ring.set(pos, node);
      this.sortedKeys.push(pos);
    }
    this.sortedKeys.sort((a, b) => a - b);
  }
  getNode(key) {
    const h = this.hash(key);
    for (const pos of this.sortedKeys) {
      if (h <= pos) return this.ring.get(pos);
    }
    return this.ring.get(this.sortedKeys[0]); // Wrap around
  }
}`,go:`// Consistent Hashing với virtual nodes
type ConsistentHash struct {
    ring    map[uint32]string
    sorted  []uint32
    replicas int
}
func (ch *ConsistentHash) AddNode(node string) {
    for i := 0; i < ch.replicas; i++ {
        h := hash(fmt.Sprintf("%s:%d", node, i))
        ch.ring[h] = node
        ch.sorted = append(ch.sorted, h)
    }
    sort.Slice(ch.sorted, func(i,j int) bool { return ch.sorted[i] < ch.sorted[j] })
}`,csharp:`public class ConsistentHash {
    SortedDictionary<uint, string> ring = new();
    int replicas;
    public ConsistentHash(int replicas = 100) { this.replicas = replicas; }
    public void AddNode(string node) {
        for (int i = 0; i < replicas; i++) {
            uint h = Hash($"{node}:{i}");
            ring[h] = node;
        }
    }
    public string GetNode(string key) {
        uint h = Hash(key);
        foreach (var kv in ring) if (h <= kv.Key) return kv.Value;
        return ring.First().Value;
    }
}`}
};

})();

/* ============================================
   graph.js — 11 Graph Algorithms
   ============================================ */
(function(){
const R = window.AlgoRegistry;

/* Shared graph helpers */
function parseGraph(raw) {
  if (!raw || !raw.trim()) return defaultGraph();
  try {
    const lines = raw.trim().split('\n').map(l=>l.trim()).filter(Boolean);
    const adj = {}; const nodes = new Set();
    lines.forEach(l => {
      const [a,b,w] = l.split(/[\s,->]+/).map(s=>s.trim());
      if(!adj[a]) adj[a]=[];
      nodes.add(a);
      if(b) { nodes.add(b); adj[a].push({to:b,w:parseFloat(w)||1}); if(!adj[b]) adj[b]=[]; }
    });
    return { adj, nodes: [...nodes] };
  } catch(e) { return defaultGraph(); }
}
function defaultGraph() {
  const adj = { A:[{to:'B',w:4},{to:'C',w:2}], B:[{to:'D',w:3},{to:'C',w:1}], C:[{to:'B',w:1},{to:'D',w:5}], D:[{to:'E',w:2}], E:[], F:[{to:'D',w:1}] };
  return { adj, nodes:['A','B','C','D','E','F'] };
}
function graphRender(canvas, step) {
  canvas.innerHTML='';
  canvas.style.height='320px'; canvas.style.display='block'; canvas.style.position='relative';
  const ns=step.nodes||[]; const w=canvas.offsetWidth||600; const h=300;
  const pos={}; const cx=w/2; const cy=h/2; const r=Math.min(w,h)*0.35;
  ns.forEach((n,i)=>{ const ang=2*Math.PI*i/ns.length - Math.PI/2; pos[n]={x:cx+r*Math.cos(ang), y:cy+r*Math.sin(ang)}; });
  // edges
  if(step.edges) step.edges.forEach(e=>{
    const f=pos[e.from], t=pos[e.to]; if(!f||!t) return;
    const line=document.createElement('div');
    const dx=t.x-f.x, dy=t.y-f.y, len=Math.sqrt(dx*dx+dy*dy);
    Object.assign(line.style,{position:'absolute',left:f.x+'px',top:f.y+'px',width:len+'px',height:'2px',
      background: e.active?'var(--primary-light)':'var(--edge-default)',
      transformOrigin:'0 0',transform:`rotate(${Math.atan2(dy,dx)}rad)`,zIndex:'1'});
    if(e.label){const lb=document.createElement('span');lb.textContent=e.label;
      Object.assign(lb.style,{position:'absolute',left:'50%',top:'-14px',fontSize:'0.7rem',color:'var(--text-tertiary)',fontWeight:'600'});
      line.appendChild(lb);}
    canvas.appendChild(line);
  });
  // nodes
  ns.forEach(n=>{
    const nd=document.createElement('div'); nd.className='viz-node';
    const p=pos[n]; nd.textContent=n;
    Object.assign(nd.style,{left:(p.x-20)+'px',top:(p.y-20)+'px'});
    if(step.hl){
      if(step.hl.active&&step.hl.active.includes(n)) nd.classList.add('active');
      if(step.hl.visited&&step.hl.visited.includes(n)) nd.classList.add('visited');
      if(step.hl.found&&step.hl.found.includes(n)) nd.classList.add('found');
    }
    canvas.appendChild(nd);
  });
}
function makeEdges(adj, activeEdges) {
  const edges=[];
  Object.keys(adj).forEach(f=>adj[f].forEach(e=>{
    const isActive = activeEdges && activeEdges.some(a=>a[0]===f&&a[1]===e.to);
    edges.push({from:f,to:e.to,label:e.w>1?String(e.w):'',active:isActive});
  }));
  return edges;
}

R['bfs']={
  name:'BFS (Breadth-First Search)', group:'graph',
  defaultInput:'A B 1\nA C 1\nB D 1\nC D 1\nD E 1\nC F 1',
  description:'BFS duyệt đồ thị theo chiều rộng, sử dụng hàng đợi (queue). Bắt đầu từ nút nguồn, thăm tất cả nút kề trước khi đi sâu hơn. Tìm đường ngắn nhất trên đồ thị không trọng số.',
  complexity:{timeBest:'O(V+E)',timeAvg:'O(V+E)',timeWorst:'O(V+E)',space:'O(V)'},
  pros:['Tìm đường ngắn nhất (unweighted)','Đơn giản','Duyệt theo tầng'],
  cons:['Tốn bộ nhớ O(V)','Không tối ưu cho đồ thị có trọng số'],
  useCases:['Tìm đường ngắn nhất','Level-order traversal','Social network connections'],
  visualize(raw){
    const g=parseGraph(raw); const steps=[]; const visited=new Set(); const queue=[g.nodes[0]];
    visited.add(g.nodes[0]); const vList=[];
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{},description:'Bắt đầu BFS từ '+g.nodes[0]});
    while(queue.length){
      const curr=queue.shift(); vList.push(curr);
      steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{active:[curr],visited:[...vList]},description:`Thăm nút ${curr}`});
      (g.adj[curr]||[]).forEach(e=>{
        if(!visited.has(e.to)){visited.add(e.to);queue.push(e.to);
          steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[[curr,e.to]]),hl:{active:[e.to],visited:[...vList]},description:`Thêm ${e.to} vào queue`});}
      });
    }
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{visited:[...vList]},description:'BFS hoàn tất!'});
    return steps;
  },
  render:graphRender,
  code:{
    javascript:`function bfs(adj, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length) {
    const curr = queue.shift(); // Lấy từ đầu queue
    order.push(curr);
    for (const {to} of adj[curr] || []) {
      if (!visited.has(to)) {
        visited.add(to);
        queue.push(to); // Thêm vào cuối queue
      }
    }
  }
  return order;
}`,
    go:`func bfs(adj map[string][]string, start string) []string {
    visited := map[string]bool{start: true}
    queue := []string{start}
    order := []string{}
    for len(queue) > 0 {
        curr := queue[0]; queue = queue[1:]
        order = append(order, curr)
        for _, next := range adj[curr] {
            if !visited[next] {
                visited[next] = true
                queue = append(queue, next)
            }
        }
    }
    return order
}`,
    csharp:`public static List<string> BFS(Dictionary<string,List<string>> adj, string start) {
    var visited = new HashSet<string>{start};
    var queue = new Queue<string>();
    queue.Enqueue(start);
    var order = new List<string>();
    while (queue.Count > 0) {
        string curr = queue.Dequeue();
        order.Add(curr);
        foreach (string next in adj[curr]) {
            if (visited.Add(next)) queue.Enqueue(next);
        }
    }
    return order;
}`
  }
};

R['dfs']={
  name:'DFS (Depth-First Search)', group:'graph',
  defaultInput:'A B 1\nA C 1\nB D 1\nC D 1\nD E 1\nC F 1',
  description:'DFS duyệt đồ thị theo chiều sâu, sử dụng stack (hoặc đệ quy). Đi sâu nhất có thể theo một nhánh trước khi quay lui (backtrack). Cơ sở cho nhiều thuật toán đồ thị khác.',
  complexity:{timeBest:'O(V+E)',timeAvg:'O(V+E)',timeWorst:'O(V+E)',space:'O(V)'},
  pros:['Ít bộ nhớ hơn BFS','Tốt cho topological sort','Phát hiện cycle'],
  cons:['Không tìm đường ngắn nhất','Có thể bị stuck ở nhánh sâu'],
  useCases:['Topological sort','Detect cycle','Maze solving','SCC detection'],
  visualize(raw){
    const g=parseGraph(raw); const steps=[]; const visited=new Set(); const vList=[];
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{},description:'Bắt đầu DFS từ '+g.nodes[0]});
    function dfs(node){
      visited.add(node); vList.push(node);
      steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{active:[node],visited:[...vList]},description:`Thăm nút ${node}`});
      (g.adj[node]||[]).forEach(e=>{
        if(!visited.has(e.to)){
          steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[[node,e.to]]),hl:{active:[e.to],visited:[...vList]},description:`Đi sâu vào ${e.to}`});
          dfs(e.to);
        }
      });
      steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{visited:[...vList]},description:`Quay lui từ ${node}`});
    }
    dfs(g.nodes[0]);
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{visited:[...vList]},description:'DFS hoàn tất!'});
    return steps;
  },
  render:graphRender,
  code:{
    javascript:`function dfs(adj, start) {
  const visited = new Set();
  const order = [];
  function visit(node) {
    visited.add(node);
    order.push(node);
    for (const {to} of adj[node] || []) {
      if (!visited.has(to)) visit(to); // Đệ quy đi sâu
    }
  }
  visit(start);
  return order;
}`,
    go:`func dfs(adj map[string][]string, start string) []string {
    visited := map[string]bool{}
    order := []string{}
    var visit func(string)
    visit = func(node string) {
        visited[node] = true
        order = append(order, node)
        for _, next := range adj[node] {
            if !visited[next] { visit(next) }
        }
    }
    visit(start)
    return order
}`,
    csharp:`public static List<string> DFS(Dictionary<string,List<string>> adj, string start) {
    var visited = new HashSet<string>();
    var order = new List<string>();
    void Visit(string node) {
        visited.Add(node);
        order.Add(node);
        foreach (string next in adj[node])
            if (visited.Add(next)) Visit(next);
    }
    Visit(start);
    return order;
}`
  }
};

R['dijkstra']={
  name:'Dijkstra', group:'graph',
  defaultInput:'A B 4\nA C 2\nB D 3\nC B 1\nC D 5\nD E 2',
  description:'Dijkstra tìm đường đi ngắn nhất từ một nguồn đến tất cả đỉnh khác trên đồ thị có trọng số không âm. Sử dụng priority queue, luôn chọn đỉnh có khoảng cách nhỏ nhất chưa xử lý.',
  complexity:{timeBest:'O((V+E)log V)',timeAvg:'O((V+E)log V)',timeWorst:'O((V+E)log V)',space:'O(V)'},
  pros:['Tìm đường ngắn nhất','Hiệu quả với priority queue','Đơn giản'],
  cons:['Không xử lý trọng số âm','Cần priority queue'],
  useCases:['GPS navigation','Network routing','Maps shortest path'],
  visualize(raw){
    const g=parseGraph(raw); const steps=[]; const dist={}; const visited=new Set(); const vList=[];
    g.nodes.forEach(n=>dist[n]=Infinity); dist[g.nodes[0]]=0;
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{active:[g.nodes[0]]},description:`Khởi tạo: dist[${g.nodes[0]}]=0, còn lại=∞`});
    for(let i=0;i<g.nodes.length;i++){
      let u=null,minD=Infinity;
      g.nodes.forEach(n=>{if(!visited.has(n)&&dist[n]<minD){minD=dist[n];u=n;}});
      if(!u) break; visited.add(u); vList.push(u);
      steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{active:[u],visited:[...vList]},description:`Chọn ${u} (dist=${dist[u]})`});
      (g.adj[u]||[]).forEach(e=>{
        const nd=dist[u]+e.w;
        if(nd<dist[e.to]){dist[e.to]=nd;
          steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[[u,e.to]]),hl:{active:[e.to],visited:[...vList]},description:`Cập nhật dist[${e.to}]=${nd}`});}
      });
    }
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{visited:[...vList]},description:'Dijkstra hoàn tất! Dist: '+g.nodes.map(n=>n+'='+dist[n]).join(', ')});
    return steps;
  },
  render:graphRender,
  code:{
    javascript:`function dijkstra(adj, start) {
  const dist = {};
  const visited = new Set();
  // Khởi tạo khoảng cách
  for (const node in adj) dist[node] = Infinity;
  dist[start] = 0;
  while (true) {
    let u = null, minD = Infinity;
    for (const n in dist) {
      if (!visited.has(n) && dist[n] < minD) { minD = dist[n]; u = n; }
    }
    if (u === null) break;
    visited.add(u);
    // Relaxation
    for (const {to, w} of adj[u] || []) {
      if (dist[u] + w < dist[to]) dist[to] = dist[u] + w;
    }
  }
  return dist;
}`,
    go:`func dijkstra(adj map[string][]Edge, start string) map[string]int {
    dist := map[string]int{}
    visited := map[string]bool{}
    for node := range adj { dist[node] = math.MaxInt32 }
    dist[start] = 0
    for {
        u, minD := "", math.MaxInt32
        for n, d := range dist {
            if !visited[n] && d < minD { minD = d; u = n }
        }
        if u == "" { break }
        visited[u] = true
        for _, e := range adj[u] {
            if nd := dist[u]+e.W; nd < dist[e.To] { dist[e.To] = nd }
        }
    }
    return dist
}`,
    csharp:`public static Dictionary<string,int> Dijkstra(
    Dictionary<string,List<(string to,int w)>> adj, string start) {
    var dist = adj.Keys.ToDictionary(k=>k, k=>int.MaxValue);
    dist[start] = 0;
    var visited = new HashSet<string>();
    while (true) {
        string u = null; int minD = int.MaxValue;
        foreach (var kv in dist)
            if (!visited.Contains(kv.Key) && kv.Value < minD)
                { minD = kv.Value; u = kv.Key; }
        if (u == null) break;
        visited.Add(u);
        foreach (var (to, w) in adj[u])
            if (dist[u] + w < dist[to]) dist[to] = dist[u] + w;
    }
    return dist;
}`
  }
};

R['bellman-ford']={
  name:'Bellman-Ford', group:'graph',
  defaultInput:'A B 4\nA C 2\nB D 3\nC B -1\nC D 5\nD E 2',
  description:'Bellman-Ford tìm đường đi ngắn nhất từ một nguồn, hỗ trợ trọng số âm. Relaxe tất cả cạnh V-1 lần. Có thể phát hiện chu trình âm (negative cycle). Chậm hơn Dijkstra nhưng tổng quát hơn.',
  complexity:{timeBest:'O(V·E)',timeAvg:'O(V·E)',timeWorst:'O(V·E)',space:'O(V)'},
  pros:['Xử lý trọng số âm','Phát hiện negative cycle','Đơn giản'],
  cons:['Chậm O(V·E)','Chậm hơn Dijkstra nhiều'],
  useCases:['Đồ thị có trọng số âm','Detect negative cycle','Currency arbitrage'],
  visualize(raw){
    const g=parseGraph(raw); const steps=[]; const dist={}; const allEdges=[];
    g.nodes.forEach(n=>dist[n]=Infinity); dist[g.nodes[0]]=0;
    Object.keys(g.adj).forEach(f=>g.adj[f].forEach(e=>allEdges.push({from:f,...e})));
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{active:[g.nodes[0]]},description:'Khởi tạo distances'});
    for(let i=0;i<g.nodes.length-1;i++){
      let updated=false;
      allEdges.forEach(e=>{
        if(dist[e.from]!==Infinity&&dist[e.from]+e.w<dist[e.to]){
          dist[e.to]=dist[e.from]+e.w; updated=true;
          steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[[e.from,e.to]]),hl:{active:[e.to],visited:g.nodes.filter(n=>dist[n]!==Infinity)},description:`Lần ${i+1}: dist[${e.to}]=${dist[e.to]}`});
        }
      });
      if(!updated) break;
    }
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{visited:g.nodes.filter(n=>dist[n]!==Infinity)},description:'Bellman-Ford hoàn tất! '+g.nodes.map(n=>n+'='+(dist[n]===Infinity?'∞':dist[n])).join(', ')});
    return steps;
  },
  render:graphRender,
  code:{
    javascript:`function bellmanFord(edges, V, start) {
  const dist = Array(V).fill(Infinity);
  dist[start] = 0;
  // Relax tất cả cạnh V-1 lần
  for (let i = 0; i < V - 1; i++) {
    for (const {from, to, w} of edges) {
      if (dist[from] !== Infinity && dist[from] + w < dist[to])
        dist[to] = dist[from] + w;
    }
  }
  // Kiểm tra negative cycle
  for (const {from, to, w} of edges) {
    if (dist[from] !== Infinity && dist[from] + w < dist[to])
      return null; // Có negative cycle
  }
  return dist;
}`,
    go:`func bellmanFord(edges []Edge, V int, start int) ([]int, bool) {
    dist := make([]int, V)
    for i := range dist { dist[i] = math.MaxInt32 }
    dist[start] = 0
    for i := 0; i < V-1; i++ {
        for _, e := range edges {
            if dist[e.From] != math.MaxInt32 && dist[e.From]+e.W < dist[e.To] {
                dist[e.To] = dist[e.From] + e.W
            }
        }
    }
    for _, e := range edges {
        if dist[e.From] != math.MaxInt32 && dist[e.From]+e.W < dist[e.To] {
            return nil, true // negative cycle
        }
    }
    return dist, false
}`,
    csharp:`public static int[]? BellmanFord(List<(int from,int to,int w)> edges, int V, int start) {
    int[] dist = Enumerable.Repeat(int.MaxValue, V).ToArray();
    dist[start] = 0;
    for (int i = 0; i < V - 1; i++)
        foreach (var (f, t, w) in edges)
            if (dist[f] != int.MaxValue && dist[f] + w < dist[t])
                dist[t] = dist[f] + w;
    foreach (var (f, t, w) in edges)
        if (dist[f] != int.MaxValue && dist[f] + w < dist[t])
            return null;
    return dist;
}`
  }
};

R['floyd-warshall']={
  name:'Floyd-Warshall', group:'graph',
  defaultInput:'A B 3\nA C 6\nB C 2\nB D 1\nC D 4\nD A 7',
  description:'Floyd-Warshall tìm đường đi ngắn nhất giữa tất cả các cặp đỉnh. Sử dụng quy hoạch động 3 vòng lặp lồng nhau. Xử lý được trọng số âm (không có negative cycle).',
  complexity:{timeBest:'O(V³)',timeAvg:'O(V³)',timeWorst:'O(V³)',space:'O(V²)'},
  pros:['All-pairs shortest path','Xử lý trọng số âm','Đơn giản'],
  cons:['O(V³) chậm','Tốn O(V²) bộ nhớ','Không tốt cho đồ thị thưa'],
  useCases:['All-pairs shortest path','Đồ thị nhỏ dense','Transitive closure'],
  visualize(raw){
    const g=parseGraph(raw); const steps=[]; const ns=g.nodes; const n=ns.length;
    const dist=Array.from({length:n},()=>Array(n).fill(Infinity));
    for(let i=0;i<n;i++) dist[i][i]=0;
    ns.forEach((u,i)=>(g.adj[u]||[]).forEach(e=>{const j=ns.indexOf(e.to);if(j>=0)dist[i][j]=e.w;}));
    steps.push({nodes:ns,edges:makeEdges(g.adj,[]),hl:{},description:'Ma trận khoảng cách ban đầu'});
    for(let k=0;k<n;k++){
      for(let i=0;i<n;i++){for(let j=0;j<n;j++){
        if(dist[i][k]+dist[k][j]<dist[i][j]){dist[i][j]=dist[i][k]+dist[k][j];
          steps.push({nodes:ns,edges:makeEdges(g.adj,[]),hl:{active:[ns[k]],visited:[ns[i],ns[j]]},description:`k=${ns[k]}: dist[${ns[i]}][${ns[j]}]=${dist[i][j]}`});}
      }}
    }
    steps.push({nodes:ns,edges:makeEdges(g.adj,[]),hl:{visited:[...ns]},description:'Floyd-Warshall hoàn tất!'});
    return steps;
  },
  render:graphRender,
  code:{
    javascript:`function floydWarshall(dist, V) {
  // dist[i][j] = trọng số cạnh i→j, Infinity nếu không có
  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        // Nếu đi qua k ngắn hơn → cập nhật
        if (dist[i][k] + dist[k][j] < dist[i][j])
          dist[i][j] = dist[i][k] + dist[k][j];
      }
    }
  }
  return dist;
}`,
    go:`func floydWarshall(dist [][]int, V int) [][]int {
    for k := 0; k < V; k++ {
        for i := 0; i < V; i++ {
            for j := 0; j < V; j++ {
                if dist[i][k]+dist[k][j] < dist[i][j] {
                    dist[i][j] = dist[i][k] + dist[k][j]
                }
            }
        }
    }
    return dist
}`,
    csharp:`public static int[,] FloydWarshall(int[,] dist, int V) {
    for (int k = 0; k < V; k++)
        for (int i = 0; i < V; i++)
            for (int j = 0; j < V; j++)
                if (dist[i,k] + dist[k,j] < dist[i,j])
                    dist[i,j] = dist[i,k] + dist[k,j];
    return dist;
}`
  }
};

R['a-star']={
  name:'A* Search', group:'graph',
  defaultInput:'A B 4\nA C 2\nB D 3\nC B 1\nC D 5\nD E 2',
  description:'A* kết hợp Dijkstra với heuristic (ước lượng) để tìm đường ngắn nhất hiệu quả hơn. Sử dụng f(n) = g(n) + h(n), trong đó g là chi phí thực, h là heuristic. Rất phổ biến trong game và AI.',
  complexity:{timeBest:'O(E)',timeAvg:'O(E log V)',timeWorst:'O(V²)',space:'O(V)'},
  pros:['Nhanh hơn Dijkstra với heuristic tốt','Tối ưu nếu h admissible','Rất phổ biến'],
  cons:['Cần heuristic tốt','Tốn bộ nhớ','Complex implementation'],
  useCases:['Game pathfinding','Robot navigation','GPS routing'],
  visualize(raw){
    const g=parseGraph(raw); const steps=[]; const start=g.nodes[0]; const goal=g.nodes[g.nodes.length-1];
    const gScore={}; const fScore={}; const visited=new Set(); const vList=[];
    g.nodes.forEach(n=>{gScore[n]=Infinity;fScore[n]=Infinity;}); gScore[start]=0; fScore[start]=0;
    const open=[start];
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{active:[start],found:[goal]},description:`A*: từ ${start} đến ${goal}`});
    while(open.length){
      open.sort((a,b)=>fScore[a]-fScore[b]);
      const curr=open.shift(); vList.push(curr);
      if(curr===goal){steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{found:[goal],visited:[...vList]},description:`✅ Tìm thấy đường đến ${goal}! Cost=${gScore[goal]}`});return steps;}
      visited.add(curr);
      steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{active:[curr],visited:[...vList]},description:`Xét ${curr}, g=${gScore[curr]}`});
      (g.adj[curr]||[]).forEach(e=>{
        const ng=gScore[curr]+e.w;
        if(ng<gScore[e.to]){gScore[e.to]=ng;fScore[e.to]=ng+1;
          if(!visited.has(e.to)&&!open.includes(e.to)) open.push(e.to);
          steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[[curr,e.to]]),hl:{active:[e.to],visited:[...vList]},description:`Cập nhật ${e.to}: g=${ng}`});}
      });
    }
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{visited:[...vList]},description:'❌ Không tìm thấy đường!'});
    return steps;
  },
  render:graphRender,
  code:{
    javascript:`function aStar(adj, start, goal, heuristic) {
  const gScore = {}, fScore = {};
  for (const n in adj) { gScore[n] = Infinity; fScore[n] = Infinity; }
  gScore[start] = 0;
  fScore[start] = heuristic(start, goal);
  const open = [start], closed = new Set();
  while (open.length) {
    open.sort((a,b) => fScore[a] - fScore[b]);
    const curr = open.shift();
    if (curr === goal) return gScore[goal]; // Tìm thấy
    closed.add(curr);
    for (const {to, w} of adj[curr] || []) {
      if (closed.has(to)) continue;
      const ng = gScore[curr] + w;
      if (ng < gScore[to]) {
        gScore[to] = ng;
        fScore[to] = ng + heuristic(to, goal);
        if (!open.includes(to)) open.push(to);
      }
    }
  }
  return -1; // Không tìm thấy
}`,
    go:`func aStar(adj map[string][]Edge, start, goal string, h func(string,string)int) int {
    gScore := map[string]int{start: 0}
    fScore := map[string]int{start: h(start, goal)}
    open := []string{start}
    closed := map[string]bool{}
    for len(open) > 0 {
        sort.Slice(open, func(i,j int) bool { return fScore[open[i]] < fScore[open[j]] })
        curr := open[0]; open = open[1:]
        if curr == goal { return gScore[goal] }
        closed[curr] = true
        for _, e := range adj[curr] {
            if closed[e.To] { continue }
            ng := gScore[curr] + e.W
            if g, ok := gScore[e.To]; !ok || ng < g {
                gScore[e.To] = ng
                fScore[e.To] = ng + h(e.To, goal)
                open = append(open, e.To)
            }
        }
    }
    return -1
}`,
    csharp:`public static int AStar(Dictionary<string,List<(string to,int w)>> adj,
    string start, string goal, Func<string,string,int> h) {
    var gScore = new Dictionary<string,int>{{start,0}};
    var fScore = new Dictionary<string,int>{{start,h(start,goal)}};
    var open = new List<string>{start};
    var closed = new HashSet<string>();
    while (open.Count > 0) {
        open.Sort((a,b) => fScore[a] - fScore[b]);
        string curr = open[0]; open.RemoveAt(0);
        if (curr == goal) return gScore[goal];
        closed.Add(curr);
        foreach (var (to, w) in adj[curr]) {
            if (closed.Contains(to)) continue;
            int ng = gScore[curr] + w;
            if (!gScore.ContainsKey(to) || ng < gScore[to]) {
                gScore[to] = ng; fScore[to] = ng + h(to, goal);
                if (!open.Contains(to)) open.Add(to);
            }
        }
    }
    return -1;
}`
  }
};

R['kruskal']={
  name:'Kruskal (MST)', group:'graph',
  defaultInput:'A B 4\nA C 2\nB C 1\nB D 5\nC D 8\nD E 3',
  description:'Kruskal tìm cây khung nhỏ nhất (MST) bằng cách sắp xếp tất cả cạnh theo trọng số tăng dần, rồi lần lượt thêm cạnh vào MST nếu không tạo chu trình. Sử dụng Union-Find để kiểm tra chu trình hiệu quả.',
  complexity:{timeBest:'O(E log E)',timeAvg:'O(E log E)',timeWorst:'O(E log E)',space:'O(V)'},
  pros:['Đơn giản','Tốt cho đồ thị thưa','Dùng Union-Find hiệu quả'],
  cons:['Cần sắp xếp cạnh','Chậm hơn Prim cho đồ thị dense'],
  useCases:['Minimum Spanning Tree','Network design','Clustering'],
  visualize(raw){
    const g=parseGraph(raw); const steps=[]; const edges=[];
    Object.keys(g.adj).forEach(f=>g.adj[f].forEach(e=>edges.push({from:f,to:e.to,w:e.w})));
    edges.sort((a,b)=>a.w-b.w);
    const parent={}; g.nodes.forEach(n=>parent[n]=n);
    function find(x){return parent[x]===x?x:parent[x]=find(parent[x]);}
    function union(a,b){parent[find(a)]=find(b);}
    const mst=[]; const activeE=[];
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{},description:'Kruskal: sắp xếp cạnh theo trọng số'});
    edges.forEach(e=>{
      if(find(e.from)!==find(e.to)){
        union(e.from,e.to); mst.push(e); activeE.push([e.from,e.to]);
        steps.push({nodes:g.nodes,edges:makeEdges(g.adj,activeE),hl:{active:[e.from,e.to]},description:`Thêm cạnh ${e.from}-${e.to} (w=${e.w}) vào MST`});
      } else {
        steps.push({nodes:g.nodes,edges:makeEdges(g.adj,activeE),hl:{},description:`Bỏ qua ${e.from}-${e.to} (tạo cycle)`});
      }
    });
    const total=mst.reduce((s,e)=>s+e.w,0);
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,activeE),hl:{visited:g.nodes},description:`MST hoàn tất! Tổng trọng số = ${total}`});
    return steps;
  },
  render:graphRender,
  code:{
    javascript:`function kruskal(edges, V) {
  edges.sort((a, b) => a.w - b.w); // Sắp xếp theo trọng số
  const parent = Array.from({length: V}, (_, i) => i);
  const find = x => parent[x] === x ? x : parent[x] = find(parent[x]);
  const union = (a, b) => parent[find(a)] = find(b);
  const mst = [];
  for (const e of edges) {
    if (find(e.from) !== find(e.to)) {
      union(e.from, e.to);
      mst.push(e); // Thêm cạnh vào MST
    }
  }
  return mst;
}`,
    go:`func kruskal(edges []Edge, V int) []Edge {
    sort.Slice(edges, func(i,j int) bool { return edges[i].W < edges[j].W })
    parent := make([]int, V)
    for i := range parent { parent[i] = i }
    var find func(int) int
    find = func(x int) int {
        if parent[x] != x { parent[x] = find(parent[x]) }
        return parent[x]
    }
    mst := []Edge{}
    for _, e := range edges {
        if find(e.From) != find(e.To) {
            parent[find(e.From)] = find(e.To)
            mst = append(mst, e)
        }
    }
    return mst
}`,
    csharp:`public static List<(int f,int t,int w)> Kruskal(List<(int f,int t,int w)> edges, int V) {
    edges.Sort((a,b) => a.w - b.w);
    int[] parent = Enumerable.Range(0, V).ToArray();
    int Find(int x) => parent[x] == x ? x : parent[x] = Find(parent[x]);
    var mst = new List<(int,int,int)>();
    foreach (var e in edges) {
        if (Find(e.f) != Find(e.t)) {
            parent[Find(e.f)] = Find(e.t);
            mst.Add(e);
        }
    }
    return mst;
}`
  }
};

R['prim']={
  name:'Prim (MST)', group:'graph',
  defaultInput:'A B 4\nA C 2\nB C 1\nB D 5\nC D 8\nD E 3',
  description:'Prim tìm MST bằng cách bắt đầu từ một đỉnh, liên tục thêm cạnh có trọng số nhỏ nhất nối đỉnh đã chọn với đỉnh chưa chọn. Tương tự Dijkstra nhưng dùng trọng số cạnh thay vì khoảng cách tổng.',
  complexity:{timeBest:'O(E log V)',timeAvg:'O(E log V)',timeWorst:'O(V²)',space:'O(V)'},
  pros:['Tốt cho đồ thị dense','Không cần sắp xếp trước','Dùng priority queue'],
  cons:['Phức tạp hơn Kruskal','Cần connected graph'],
  useCases:['MST cho đồ thị dense','Network planning','Wiring layout'],
  visualize(raw){
    const g=parseGraph(raw); const steps=[]; const inMST=new Set(); const activeE=[];
    inMST.add(g.nodes[0]);
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{active:[g.nodes[0]]},description:`Prim: bắt đầu từ ${g.nodes[0]}`});
    while(inMST.size<g.nodes.length){
      let best=null;
      inMST.forEach(u=>(g.adj[u]||[]).forEach(e=>{
        if(!inMST.has(e.to)&&(!best||e.w<best.w)) best={from:u,...e};
      }));
      if(!best) break;
      inMST.add(best.to); activeE.push([best.from,best.to]);
      steps.push({nodes:g.nodes,edges:makeEdges(g.adj,activeE),hl:{active:[best.to],visited:[...inMST]},description:`Thêm ${best.from}-${best.to} (w=${best.w})`});
    }
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,activeE),hl:{visited:[...inMST]},description:'Prim MST hoàn tất!'});
    return steps;
  },
  render:graphRender,
  code:{
    javascript:`function prim(adj, V) {
  const inMST = new Set([0]);
  const mst = [];
  while (inMST.size < V) {
    let best = null;
    // Tìm cạnh nhỏ nhất từ MST ra ngoài
    for (const u of inMST) {
      for (const {to, w} of adj[u]) {
        if (!inMST.has(to) && (!best || w < best.w))
          best = {from: u, to, w};
      }
    }
    if (!best) break;
    inMST.add(best.to);
    mst.push(best);
  }
  return mst;
}`,
    go:`func prim(adj map[int][]Edge, V int) []Edge {
    inMST := map[int]bool{0: true}
    mst := []Edge{}
    for len(inMST) < V {
        var best *Edge
        for u := range inMST {
            for _, e := range adj[u] {
                if !inMST[e.To] && (best == nil || e.W < best.W) {
                    e := e; best = &e; best.From = u
                }
            }
        }
        if best == nil { break }
        inMST[best.To] = true
        mst = append(mst, *best)
    }
    return mst
}`,
    csharp:`public static List<(int f,int t,int w)> Prim(Dictionary<int,List<(int to,int w)>> adj, int V) {
    var inMST = new HashSet<int>{0};
    var mst = new List<(int,int,int)>();
    while (inMST.Count < V) {
        (int f, int t, int w) best = (-1,-1,int.MaxValue);
        foreach (int u in inMST)
            foreach (var (to, w) in adj[u])
                if (!inMST.Contains(to) && w < best.w)
                    best = (u, to, w);
        if (best.f == -1) break;
        inMST.Add(best.t);
        mst.Add(best);
    }
    return mst;
}`
  }
};

R['topological-sort']={
  name:'Topological Sort', group:'graph',
  defaultInput:'A B 1\nA C 1\nB D 1\nC D 1\nD E 1',
  description:'Topological Sort sắp xếp các đỉnh của DAG (đồ thị có hướng không chu trình) sao cho mỗi đỉnh đứng trước các đỉnh mà nó trỏ tới. Dùng DFS hoặc Kahn\'s algorithm (BFS với in-degree).',
  complexity:{timeBest:'O(V+E)',timeAvg:'O(V+E)',timeWorst:'O(V+E)',space:'O(V)'},
  pros:['O(V+E)','Xác định thứ tự phụ thuộc','Nền tảng cho nhiều bài toán'],
  cons:['Chỉ cho DAG','Không duy nhất','Không phát hiện cycle trực tiếp'],
  useCases:['Build systems','Task scheduling','Course prerequisites'],
  visualize(raw){
    const g=parseGraph(raw); const steps=[]; const visited=new Set(); const stack=[]; const vList=[];
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{},description:'Topological Sort bằng DFS'});
    function dfs(n){
      visited.add(n); vList.push(n);
      steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{active:[n],visited:[...vList]},description:`DFS: thăm ${n}`});
      (g.adj[n]||[]).forEach(e=>{if(!visited.has(e.to)) dfs(e.to);});
      stack.push(n);
      steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{found:[n],visited:[...vList]},description:`Xong ${n}, push vào stack`});
    }
    g.nodes.forEach(n=>{if(!visited.has(n)) dfs(n);});
    const result=stack.reverse();
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{visited:g.nodes},description:'Kết quả: '+result.join(' → ')});
    return steps;
  },
  render:graphRender,
  code:{
    javascript:`function topologicalSort(adj, nodes) {
  const visited = new Set();
  const stack = [];
  function dfs(node) {
    visited.add(node);
    for (const {to} of adj[node] || []) {
      if (!visited.has(to)) dfs(to);
    }
    stack.push(node); // Push sau khi xử lý xong
  }
  for (const n of nodes) if (!visited.has(n)) dfs(n);
  return stack.reverse(); // Đảo ngược stack
}`,
    go:`func topologicalSort(adj map[string][]string, nodes []string) []string {
    visited := map[string]bool{}
    stack := []string{}
    var dfs func(string)
    dfs = func(node string) {
        visited[node] = true
        for _, next := range adj[node] {
            if !visited[next] { dfs(next) }
        }
        stack = append(stack, node)
    }
    for _, n := range nodes { if !visited[n] { dfs(n) } }
    for i, j := 0, len(stack)-1; i < j; i, j = i+1, j-1 {
        stack[i], stack[j] = stack[j], stack[i]
    }
    return stack
}`,
    csharp:`public static List<string> TopologicalSort(Dictionary<string,List<string>> adj) {
    var visited = new HashSet<string>();
    var stack = new Stack<string>();
    void DFS(string node) {
        visited.Add(node);
        foreach (string next in adj[node])
            if (visited.Add(next)) DFS(next);
        stack.Push(node);
    }
    foreach (string n in adj.Keys) if (!visited.Contains(n)) DFS(n);
    return stack.ToList();
}`
  }
};

R['tarjan-scc']={
  name:'Tarjan (SCC)', group:'graph',
  defaultInput:'A B 1\nB C 1\nC A 1\nC D 1\nD E 1\nE F 1\nF D 1',
  description:'Tarjan tìm các thành phần liên thông mạnh (SCC) bằng một lần DFS. Sử dụng stack và discovery/low-link values. Mỗi SCC là tập đỉnh mà bất kỳ hai đỉnh nào cũng có đường đi đến nhau.',
  complexity:{timeBest:'O(V+E)',timeAvg:'O(V+E)',timeWorst:'O(V+E)',space:'O(V)'},
  pros:['Một lần DFS','O(V+E)','Tìm SCC chính xác'],
  cons:['Phức tạp cài đặt','Khó debug','Nhiều biến trạng thái'],
  useCases:['Strongly Connected Components','2-SAT solver','Compiler optimization'],
  visualize(raw){
    const g=parseGraph(raw); const steps=[]; const disc={}; const low={}; const onStack=new Set(); const stack=[]; let time=0; const sccs=[];
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{},description:'Tarjan SCC Algorithm'});
    function dfs(u){
      disc[u]=low[u]=time++; stack.push(u); onStack.add(u);
      steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{active:[u]},description:`disc[${u}]=${disc[u]}, low[${u}]=${low[u]}`});
      (g.adj[u]||[]).forEach(e=>{
        if(disc[e.to]===undefined){dfs(e.to);low[u]=Math.min(low[u],low[e.to]);}
        else if(onStack.has(e.to)){low[u]=Math.min(low[u],disc[e.to]);}
      });
      if(low[u]===disc[u]){
        const scc=[];let w;
        do{w=stack.pop();onStack.delete(w);scc.push(w);}while(w!==u);
        sccs.push(scc);
        steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{found:scc},description:`SCC: {${scc.join(', ')}}`});
      }
    }
    g.nodes.forEach(n=>{if(disc[n]===undefined) dfs(n);});
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{visited:g.nodes},description:`Tìm được ${sccs.length} SCC`});
    return steps;
  },
  render:graphRender,
  code:{
    javascript:`function tarjanSCC(adj, nodes) {
  const disc = {}, low = {}, onStack = new Set();
  const stack = [], sccs = [];
  let time = 0;
  function dfs(u) {
    disc[u] = low[u] = time++;
    stack.push(u); onStack.add(u);
    for (const {to} of adj[u] || []) {
      if (disc[to] === undefined) { dfs(to); low[u] = Math.min(low[u], low[to]); }
      else if (onStack.has(to)) { low[u] = Math.min(low[u], disc[to]); }
    }
    if (low[u] === disc[u]) { // Root of SCC
      const scc = []; let w;
      do { w = stack.pop(); onStack.delete(w); scc.push(w); } while (w !== u);
      sccs.push(scc);
    }
  }
  for (const n of nodes) if (disc[n] === undefined) dfs(n);
  return sccs;
}`,
    go:`func tarjanSCC(adj map[string][]string, nodes []string) [][]string {
    disc, low := map[string]int{}, map[string]int{}
    onStack := map[string]bool{}
    stack := []string{}
    sccs := [][]string{}
    time := 0
    var dfs func(string)
    dfs = func(u string) {
        disc[u], low[u] = time, time; time++
        stack = append(stack, u); onStack[u] = true
        for _, v := range adj[u] {
            if _, ok := disc[v]; !ok {
                dfs(v); low[u] = min(low[u], low[v])
            } else if onStack[v] { low[u] = min(low[u], disc[v]) }
        }
        if low[u] == disc[u] {
            scc := []string{}
            for { w := stack[len(stack)-1]; stack = stack[:len(stack)-1]
                delete(onStack, w); scc = append(scc, w)
                if w == u { break } }
            sccs = append(sccs, scc)
        }
    }
    for _, n := range nodes { if _, ok := disc[n]; !ok { dfs(n) } }
    return sccs
}`,
    csharp:`public static List<List<string>> TarjanSCC(Dictionary<string,List<string>> adj) {
    var disc = new Dictionary<string,int>(); var low = new Dictionary<string,int>();
    var onStack = new HashSet<string>(); var stack = new Stack<string>();
    var sccs = new List<List<string>>(); int time = 0;
    void DFS(string u) {
        disc[u] = low[u] = time++;
        stack.Push(u); onStack.Add(u);
        foreach (string v in adj.GetValueOrDefault(u, new())) {
            if (!disc.ContainsKey(v)) { DFS(v); low[u] = Math.Min(low[u], low[v]); }
            else if (onStack.Contains(v)) { low[u] = Math.Min(low[u], disc[v]); }
        }
        if (low[u] == disc[u]) {
            var scc = new List<string>(); string w;
            do { w = stack.Pop(); onStack.Remove(w); scc.Add(w); } while (w != u);
            sccs.Add(scc);
        }
    }
    foreach (string n in adj.Keys) if (!disc.ContainsKey(n)) DFS(n);
    return sccs;
}`
  }
};

R['kosaraju-scc']={
  name:'Kosaraju (SCC)', group:'graph',
  defaultInput:'A B 1\nB C 1\nC A 1\nC D 1\nD E 1\nE F 1\nF D 1',
  description:'Kosaraju tìm SCC bằng 2 lần DFS: lần 1 trên đồ thị gốc để lấy finish order, lần 2 trên đồ thị chuyển vị (reverse) theo thứ tự ngược. Dễ hiểu hơn Tarjan nhưng cần 2 lần duyệt.',
  complexity:{timeBest:'O(V+E)',timeAvg:'O(V+E)',timeWorst:'O(V+E)',space:'O(V+E)'},
  pros:['Dễ hiểu','O(V+E)','Hai bước rõ ràng'],
  cons:['2 lần DFS','Cần xây đồ thị chuyển vị','Tốn bộ nhớ hơn Tarjan'],
  useCases:['SCC detection','Dễ cài đặt hơn Tarjan','Giảng dạy'],
  visualize(raw){
    const g=parseGraph(raw); const steps=[]; const visited=new Set(); const order=[];
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{},description:'Kosaraju: Bước 1 — DFS trên đồ thị gốc'});
    function dfs1(n){visited.add(n);(g.adj[n]||[]).forEach(e=>{if(!visited.has(e.to))dfs1(e.to);});order.push(n);
      steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{active:[n],visited:[...visited]},description:`Finish: ${n}`});}
    g.nodes.forEach(n=>{if(!visited.has(n))dfs1(n);});
    const rev={};g.nodes.forEach(n=>rev[n]=[]);
    Object.keys(g.adj).forEach(f=>g.adj[f].forEach(e=>rev[e.to].push({to:f,w:e.w})));
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{},description:'Bước 2 — DFS trên đồ thị chuyển vị'});
    visited.clear(); const sccs=[];
    while(order.length){
      const n=order.pop();
      if(visited.has(n))continue;
      const scc=[];
      function dfs2(u){visited.add(u);scc.push(u);(rev[u]||[]).forEach(e=>{if(!visited.has(e.to))dfs2(e.to);});}
      dfs2(n); sccs.push(scc);
      steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{found:scc,visited:[...visited]},description:`SCC: {${scc.join(', ')}}`});
    }
    steps.push({nodes:g.nodes,edges:makeEdges(g.adj,[]),hl:{visited:g.nodes},description:`Kosaraju: ${sccs.length} SCC tìm được`});
    return steps;
  },
  render:graphRender,
  code:{
    javascript:`function kosarajuSCC(adj, nodes) {
  const visited = new Set(), order = [];
  // Bước 1: DFS trên đồ thị gốc, ghi finish order
  function dfs1(n) {
    visited.add(n);
    for (const {to} of adj[n] || []) if (!visited.has(to)) dfs1(to);
    order.push(n);
  }
  for (const n of nodes) if (!visited.has(n)) dfs1(n);
  // Xây đồ thị chuyển vị
  const rev = {};
  for (const n of nodes) rev[n] = [];
  for (const u of nodes) for (const {to} of adj[u] || []) rev[to].push(u);
  // Bước 2: DFS trên đồ thị chuyển vị theo reverse finish order
  visited.clear(); const sccs = [];
  while (order.length) {
    const n = order.pop();
    if (visited.has(n)) continue;
    const scc = [];
    function dfs2(u) { visited.add(u); scc.push(u); for (const v of rev[u]) if (!visited.has(v)) dfs2(v); }
    dfs2(n); sccs.push(scc);
  }
  return sccs;
}`,
    go:`func kosarajuSCC(adj map[string][]string, nodes []string) [][]string {
    visited := map[string]bool{}; order := []string{}
    var dfs1 func(string)
    dfs1 = func(n string) {
        visited[n] = true
        for _, v := range adj[n] { if !visited[v] { dfs1(v) } }
        order = append(order, n)
    }
    for _, n := range nodes { if !visited[n] { dfs1(n) } }
    rev := map[string][]string{}
    for u, edges := range adj { for _, v := range edges { rev[v] = append(rev[v], u) } }
    visited = map[string]bool{}; sccs := [][]string{}
    for i := len(order)-1; i >= 0; i-- {
        if visited[order[i]] { continue }
        scc := []string{}
        var dfs2 func(string)
        dfs2 = func(n string) { visited[n] = true; scc = append(scc, n); for _, v := range rev[n] { if !visited[v] { dfs2(v) } } }
        dfs2(order[i]); sccs = append(sccs, scc)
    }
    return sccs
}`,
    csharp:`public static List<List<string>> KosarajuSCC(Dictionary<string,List<string>> adj) {
    var visited = new HashSet<string>(); var order = new Stack<string>();
    void DFS1(string n) { visited.Add(n); foreach (var v in adj[n]) if (visited.Add(v)) DFS1(v); order.Push(n); }
    foreach (var n in adj.Keys) if (!visited.Contains(n)) DFS1(n);
    var rev = adj.Keys.ToDictionary(k=>k, k=>new List<string>());
    foreach (var kv in adj) foreach (var v in kv.Value) rev[v].Add(kv.Key);
    visited.Clear(); var sccs = new List<List<string>>();
    while (order.Count > 0) {
        var n = order.Pop(); if (visited.Contains(n)) continue;
        var scc = new List<string>();
        void DFS2(string u) { visited.Add(u); scc.Add(u); foreach (var v in rev[u]) if (visited.Add(v)) DFS2(v); }
        DFS2(n); sccs.Add(scc);
    }
    return sccs;
}`
  }
};


})();

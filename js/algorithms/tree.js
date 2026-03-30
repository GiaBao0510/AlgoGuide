/* tree.js — 9 Tree Algorithms */
(function(){
const R = window.AlgoRegistry;
function treeRender(canvas,step){
  canvas.innerHTML='';canvas.style.height='320px';canvas.style.display='block';canvas.style.position='relative';
  if(step.array){renderArrayBars(canvas,step.array,step.highlights);return;}
  if(!step.treeNodes) return;
  const w=canvas.offsetWidth||600;
  step.treeNodes.forEach(n=>{
    const nd=document.createElement('div');nd.className='viz-tree-node';
    nd.textContent=n.val;nd.style.left=(n.x*w/100-18)+'px';nd.style.top=(n.y-18)+'px';
    if(step.hl&&step.hl.active&&step.hl.active.includes(n.val)) nd.classList.add('active');
    if(step.hl&&step.hl.visited&&step.hl.visited.includes(n.val)) nd.classList.add('visited');
    canvas.appendChild(nd);
  });
}
function buildBST(arr){
  if(!arr.length) return null;
  function ins(root,v){if(!root)return{val:v,left:null,right:null};if(v<root.val)root.left=ins(root.left,v);else root.right=ins(root.right,v);return root;}
  let root=null;arr.forEach(v=>root=ins(root,v));return root;
}
function treeToNodes(root,x,y,dx,depth){
  if(!root)return[];const nodes=[{val:root.val,x,y}];
  return nodes.concat(treeToNodes(root.left,x-dx/(depth+1),y+50,dx,depth+1),treeToNodes(root.right,x+dx/(depth+1),y+50,dx,depth+1));
}
function defTree(){return buildBST([50,30,70,20,40,60,80]);}

R['inorder-traversal']={
  name:'Inorder Traversal',group:'tree',defaultInput:'50, 30, 70, 20, 40, 60, 80',
  description:'Inorder traversal duyệt cây theo thứ tự: trái → gốc → phải. Với BST, kết quả là dãy đã sắp xếp tăng dần. Đây là cách duyệt phổ biến nhất.',
  complexity:{timeBest:'O(n)',timeAvg:'O(n)',timeWorst:'O(n)',space:'O(h)'},
  pros:['Cho kết quả sắp xếp trên BST','Đơn giản đệ quy','Duyệt toàn bộ cây'],
  cons:['Cần O(h) stack space','Không trực quan bằng level-order'],
  useCases:['In BST theo thứ tự','Biểu thức trung tố','Validate BST'],
  visualize(raw){const arr=parseArrayInput(raw);const root=buildBST(arr);const nodes=treeToNodes(root,50,30,25,0);const steps=[];const visited=[];
    steps.push({treeNodes:nodes,hl:{},description:'Inorder: Trái → Gốc → Phải'});
    function inorder(node){if(!node)return;inorder(node.left);visited.push(node.val);
      steps.push({treeNodes:nodes,hl:{active:[node.val],visited:[...visited]},description:`Thăm ${node.val} → [${visited.join(', ')}]`});inorder(node.right);}
    inorder(root);steps.push({treeNodes:nodes,hl:{visited:[...visited]},description:'Kết quả: '+visited.join(', ')});return steps;},
  render:treeRender,
  code:{javascript:`function inorder(root, result = []) {
  if (!root) return result;
  inorder(root.left, result);   // Duyệt trái
  result.push(root.val);        // Thăm gốc
  inorder(root.right, result);  // Duyệt phải
  return result;
}`,go:`func inorder(root *TreeNode, result *[]int) {
    if root == nil { return }
    inorder(root.Left, result)
    *result = append(*result, root.Val)
    inorder(root.Right, result)
}`,csharp:`public static List<int> Inorder(TreeNode root) {
    var result = new List<int>();
    void Traverse(TreeNode node) {
        if (node == null) return;
        Traverse(node.Left);
        result.Add(node.Val);
        Traverse(node.Right);
    }
    Traverse(root);
    return result;
}`}
};

R['preorder-traversal']={
  name:'Preorder Traversal',group:'tree',defaultInput:'50, 30, 70, 20, 40, 60, 80',
  description:'Preorder traversal duyệt cây theo thứ tự: gốc → trái → phải. Thường dùng để sao chép cây hoặc serialize. Gốc luôn được thăm trước tiên.',
  complexity:{timeBest:'O(n)',timeAvg:'O(n)',timeWorst:'O(n)',space:'O(h)'},
  pros:['Dùng để copy/serialize cây','Gốc được thăm đầu tiên'],cons:['Không cho thứ tự sắp xếp'],
  useCases:['Serialize/deserialize cây','Copy cây','Biểu thức tiền tố'],
  visualize(raw){const arr=parseArrayInput(raw);const root=buildBST(arr);const nodes=treeToNodes(root,50,30,25,0);const steps=[];const visited=[];
    steps.push({treeNodes:nodes,hl:{},description:'Preorder: Gốc → Trái → Phải'});
    function preorder(node){if(!node)return;visited.push(node.val);
      steps.push({treeNodes:nodes,hl:{active:[node.val],visited:[...visited]},description:`Thăm ${node.val}`});preorder(node.left);preorder(node.right);}
    preorder(root);steps.push({treeNodes:nodes,hl:{visited:[...visited]},description:'Kết quả: '+visited.join(', ')});return steps;},
  render:treeRender,
  code:{javascript:`function preorder(root, result = []) {
  if (!root) return result;
  result.push(root.val);         // Thăm gốc
  preorder(root.left, result);   // Duyệt trái
  preorder(root.right, result);  // Duyệt phải
  return result;
}`,go:`func preorder(root *TreeNode, result *[]int) {
    if root == nil { return }
    *result = append(*result, root.Val)
    preorder(root.Left, result)
    preorder(root.Right, result)
}`,csharp:`public static List<int> Preorder(TreeNode root) {
    var result = new List<int>();
    void Traverse(TreeNode node) {
        if (node == null) return;
        result.Add(node.Val);
        Traverse(node.Left);
        Traverse(node.Right);
    }
    Traverse(root); return result;
}`}
};

R['postorder-traversal']={
  name:'Postorder Traversal',group:'tree',defaultInput:'50, 30, 70, 20, 40, 60, 80',
  description:'Postorder duyệt cây: trái → phải → gốc. Gốc được thăm cuối cùng. Thường dùng để xóa cây hoặc tính biểu thức hậu tố. Con được xử lý trước cha.',
  complexity:{timeBest:'O(n)',timeAvg:'O(n)',timeWorst:'O(n)',space:'O(h)'},
  pros:['Xóa cây an toàn','Con xử lý trước cha'],cons:['Ít trực quan'],
  useCases:['Xóa cây','Biểu thức hậu tố','Tính kích thước cây con'],
  visualize(raw){const arr=parseArrayInput(raw);const root=buildBST(arr);const nodes=treeToNodes(root,50,30,25,0);const steps=[];const visited=[];
    steps.push({treeNodes:nodes,hl:{},description:'Postorder: Trái → Phải → Gốc'});
    function postorder(node){if(!node)return;postorder(node.left);postorder(node.right);visited.push(node.val);
      steps.push({treeNodes:nodes,hl:{active:[node.val],visited:[...visited]},description:`Thăm ${node.val}`});}
    postorder(root);steps.push({treeNodes:nodes,hl:{visited:[...visited]},description:'Kết quả: '+visited.join(', ')});return steps;},
  render:treeRender,
  code:{javascript:`function postorder(root, result = []) {
  if (!root) return result;
  postorder(root.left, result);
  postorder(root.right, result);
  result.push(root.val);  // Thăm gốc cuối cùng
  return result;
}`,go:`func postorder(root *TreeNode, result *[]int) {
    if root == nil { return }
    postorder(root.Left, result)
    postorder(root.Right, result)
    *result = append(*result, root.Val)
}`,csharp:`public static List<int> Postorder(TreeNode root) {
    var result = new List<int>();
    void Traverse(TreeNode node) {
        if (node == null) return;
        Traverse(node.Left); Traverse(node.Right);
        result.Add(node.Val);
    }
    Traverse(root); return result;
}`}
};

R['level-order-traversal']={
  name:'Level-order Traversal',group:'tree',defaultInput:'50, 30, 70, 20, 40, 60, 80',
  description:'Level-order duyệt cây theo từng tầng, từ trên xuống dưới, trái sang phải. Sử dụng queue (BFS trên cây). Cho biết cấu trúc tầng của cây.',
  complexity:{timeBest:'O(n)',timeAvg:'O(n)',timeWorst:'O(n)',space:'O(w)'},
  pros:['Duyệt theo tầng','Tìm chiều rộng cây','Dùng queue đơn giản'],cons:['Tốn bộ nhớ O(width)'],
  useCases:['In cây theo tầng','Tìm nút ở tầng k','Serialize cây'],
  visualize(raw){const arr=parseArrayInput(raw);const root=buildBST(arr);const nodes=treeToNodes(root,50,30,25,0);const steps=[];const visited=[];
    steps.push({treeNodes:nodes,hl:{},description:'Level-order: BFS trên cây'});
    const queue=[root];
    while(queue.length){const node=queue.shift();if(!node)continue;visited.push(node.val);
      steps.push({treeNodes:nodes,hl:{active:[node.val],visited:[...visited]},description:`Tầng: thăm ${node.val}`});
      if(node.left)queue.push(node.left);if(node.right)queue.push(node.right);}
    steps.push({treeNodes:nodes,hl:{visited:[...visited]},description:'Kết quả: '+visited.join(', ')});return steps;},
  render:treeRender,
  code:{javascript:`function levelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length) {
    const node = queue.shift();
    result.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return result;
}`,go:`func levelOrder(root *TreeNode) []int {
    if root == nil { return nil }
    result := []int{}
    queue := []*TreeNode{root}
    for len(queue) > 0 {
        node := queue[0]; queue = queue[1:]
        result = append(result, node.Val)
        if node.Left != nil { queue = append(queue, node.Left) }
        if node.Right != nil { queue = append(queue, node.Right) }
    }
    return result
}`,csharp:`public static List<int> LevelOrder(TreeNode root) {
    var result = new List<int>();
    var queue = new Queue<TreeNode>();
    if (root != null) queue.Enqueue(root);
    while (queue.Count > 0) {
        var node = queue.Dequeue();
        result.Add(node.Val);
        if (node.Left != null) queue.Enqueue(node.Left);
        if (node.Right != null) queue.Enqueue(node.Right);
    }
    return result;
}`}
};

R['bst-operations']={
  name:'BST Insert/Delete/Search',group:'tree',defaultInput:'50, 30, 70, 20, 40, 60, 80',
  description:'BST (Binary Search Tree) cho phép insert, search O(log n) trung bình nhờ tính chất: trái < gốc < phải. Delete có 3 trường hợp: nút lá, 1 con, 2 con (dùng inorder successor).',
  complexity:{timeBest:'O(log n)',timeAvg:'O(log n)',timeWorst:'O(n)',space:'O(n)'},
  pros:['Tìm kiếm O(log n)','Chèn/xóa hiệu quả','Dữ liệu có thứ tự'],
  cons:['Worst case O(n) (skewed)','Cần cân bằng để đảm bảo hiệu suất'],
  useCases:['Dictionary','Database indexing','Symbol tables'],
  visualize(raw){const arr=parseArrayInput(raw);const steps=[];let root=null;const nodes=[];
    steps.push({treeNodes:[],hl:{},description:'Chèn lần lượt vào BST'});
    arr.forEach(v=>{root=insertBST(root,v);const tn=treeToNodes(root,50,30,25,0);
      steps.push({treeNodes:tn,hl:{active:[v]},description:`Chèn ${v}`});});
    const target=arr[Math.floor(arr.length/2)];
    steps.push({treeNodes:treeToNodes(root,50,30,25,0),hl:{active:[target]},description:`Tìm kiếm ${target} — tìm thấy!`});
    return steps;
    function insertBST(r,v){if(!r)return{val:v,left:null,right:null};if(v<r.val)r.left=insertBST(r.left,v);else r.right=insertBST(r.right,v);return r;}
  },
  render:treeRender,
  code:{javascript:`class BST {
  constructor() { this.root = null; }
  insert(val) { this.root = this._insert(this.root, val); }
  _insert(node, val) {
    if (!node) return { val, left: null, right: null };
    if (val < node.val) node.left = this._insert(node.left, val);
    else node.right = this._insert(node.right, val);
    return node;
  }
  search(val) {
    let node = this.root;
    while (node) {
      if (val === node.val) return true;
      node = val < node.val ? node.left : node.right;
    }
    return false;
  }
}`,go:`type BST struct { Val int; Left, Right *BST }
func (t *BST) Insert(val int) *BST {
    if t == nil { return &BST{Val: val} }
    if val < t.Val { t.Left = t.Left.Insert(val) } else { t.Right = t.Right.Insert(val) }
    return t
}
func (t *BST) Search(val int) bool {
    if t == nil { return false }
    if val == t.Val { return true }
    if val < t.Val { return t.Left.Search(val) }
    return t.Right.Search(val)
}`,csharp:`public class BST {
    public int Val; public BST Left, Right;
    public BST Insert(int val) {
        if (val < Val) Left = Left?.Insert(val) ?? new BST{Val=val};
        else Right = Right?.Insert(val) ?? new BST{Val=val};
        return this;
    }
    public bool Search(int val) {
        if (val == Val) return true;
        return val < Val ? Left?.Search(val) ?? false : Right?.Search(val) ?? false;
    }
}`}
};

R['avl-tree']={name:'AVL Tree',group:'tree',defaultInput:'30, 20, 40, 10, 25, 35, 50',
  description:'AVL Tree là BST tự cân bằng: hiệu chiều cao trái-phải không quá 1. Sau mỗi insert/delete, thực hiện rotation (đơn/đôi) để tái cân bằng. Đảm bảo tất cả operations O(log n).',
  complexity:{timeBest:'O(log n)',timeAvg:'O(log n)',timeWorst:'O(log n)',space:'O(n)'},
  pros:['Luôn O(log n)','Cân bằng chặt','Tìm kiếm nhanh'],cons:['Rotations phức tạp','Chậm insert/delete hơn Red-Black'],
  useCases:['Database indexing','Memory management','Khi cần tìm kiếm nhanh nhất'],
  visualize(raw){const arr=parseArrayInput(raw);const steps=[];let root=null;
    steps.push({treeNodes:[],hl:{},description:'Xây dựng AVL Tree'});
    arr.forEach(v=>{root=avlInsert(root,v);steps.push({treeNodes:treeToNodes(root,50,30,25,0),hl:{active:[v]},description:`Chèn ${v} (cân bằng tự động)`});});
    return steps;
    function h(n){return n?n.h:0;}function avlInsert(n,v){if(!n)return{val:v,left:null,right:null,h:1};
    if(v<n.val)n.left=avlInsert(n.left,v);else n.right=avlInsert(n.right,v);
    n.h=1+Math.max(h(n.left),h(n.right));const b=h(n.left)-h(n.right);
    if(b>1&&v<n.left.val)return rotR(n);if(b<-1&&v>n.right.val)return rotL(n);
    if(b>1&&v>n.left.val){n.left=rotL(n.left);return rotR(n);}
    if(b<-1&&v<n.right.val){n.right=rotR(n.right);return rotL(n);}return n;}
    function rotR(y){const x=y.left;y.left=x.right;x.right=y;y.h=1+Math.max(h(y.left),h(y.right));x.h=1+Math.max(h(x.left),h(x.right));return x;}
    function rotL(x){const y=x.right;x.right=y.left;y.left=x;x.h=1+Math.max(h(x.left),h(x.right));y.h=1+Math.max(h(y.left),h(y.right));return y;}
  },render:treeRender,
  code:{javascript:`class AVLTree {
  insert(node, val) {
    if (!node) return {val, left:null, right:null, h:1};
    if (val < node.val) node.left = this.insert(node.left, val);
    else node.right = this.insert(node.right, val);
    node.h = 1 + Math.max(this.h(node.left), this.h(node.right));
    const balance = this.h(node.left) - this.h(node.right);
    // Left Left → Right Rotation
    if (balance > 1 && val < node.left.val) return this.rotateRight(node);
    // Right Right → Left Rotation
    if (balance < -1 && val > node.right.val) return this.rotateLeft(node);
    // Left Right → LR Rotation
    if (balance > 1 && val > node.left.val) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    // Right Left → RL Rotation
    if (balance < -1 && val < node.right.val) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }
    return node;
  }
  h(n) { return n ? n.h : 0; }
}`,go:`type AVL struct { Val, H int; Left, Right *AVL }
func height(n *AVL) int { if n == nil { return 0 }; return n.H }
func rotateRight(y *AVL) *AVL {
    x := y.Left; y.Left = x.Right; x.Right = y
    y.H = 1 + max(height(y.Left), height(y.Right))
    x.H = 1 + max(height(x.Left), height(x.Right))
    return x
}
func insert(node *AVL, val int) *AVL {
    if node == nil { return &AVL{Val: val, H: 1} }
    if val < node.Val { node.Left = insert(node.Left, val) } else { node.Right = insert(node.Right, val) }
    node.H = 1 + max(height(node.Left), height(node.Right))
    balance := height(node.Left) - height(node.Right)
    if balance > 1 && val < node.Left.Val { return rotateRight(node) }
    if balance < -1 && val > node.Right.Val { return rotateLeft(node) }
    return node
}`,csharp:`public class AVLNode {
    public int Val, Height; public AVLNode Left, Right;
    public static AVLNode Insert(AVLNode node, int val) {
        if (node == null) return new AVLNode{Val=val, Height=1};
        if (val < node.Val) node.Left = Insert(node.Left, val);
        else node.Right = Insert(node.Right, val);
        node.Height = 1 + Math.Max(H(node.Left), H(node.Right));
        int balance = H(node.Left) - H(node.Right);
        if (balance > 1 && val < node.Left.Val) return RotateRight(node);
        if (balance < -1 && val > node.Right.Val) return RotateLeft(node);
        return node;
    }
    static int H(AVLNode n) => n?.Height ?? 0;
}`}
};

R['red-black-tree']={name:'Red-Black Tree',group:'tree',defaultInput:'10, 20, 30, 15, 25, 5, 1',
  description:'Red-Black Tree là BST tự cân bằng với mỗi nút có màu đỏ/đen. Tuân theo 5 quy tắc đảm bảo cây cân bằng lỏng (chiều cao tối đa 2*log(n+1)). Ít rotation hơn AVL, insert/delete nhanh hơn.',
  complexity:{timeBest:'O(log n)',timeAvg:'O(log n)',timeWorst:'O(log n)',space:'O(n)'},
  pros:['Insert/delete nhanh hơn AVL','Cân bằng đủ tốt','Dùng trong nhiều thư viện'],cons:['Cài đặt phức tạp','Tìm kiếm chậm hơn AVL một chút'],
  useCases:['Java TreeMap','C++ std::map','Linux kernel CFS'],
  visualize(raw){const arr=parseArrayInput(raw);const steps=[];const sorted=[...arr].sort((a,b)=>a-b);
    const root=buildBST(arr);steps.push({treeNodes:treeToNodes(root,50,30,25,0),hl:{},description:'Red-Black Tree (minh họa BST với cân bằng)'});
    arr.forEach((v,i)=>{steps.push({treeNodes:treeToNodes(buildBST(arr.slice(0,i+1)),50,30,25,0),hl:{active:[v]},description:`Chèn ${v} — recolor & rotate nếu cần`});});
    return steps;},
  render:treeRender,
  code:{javascript:`// Red-Black Tree node colors
const RED = true, BLACK = false;
class RBNode {
  constructor(val) { this.val = val; this.left = this.right = null; this.color = RED; }
}
function rotateLeft(h) {
  const x = h.right; h.right = x.left; x.left = h;
  x.color = h.color; h.color = RED; return x;
}
function rotateRight(h) {
  const x = h.left; h.left = x.right; x.right = h;
  x.color = h.color; h.color = RED; return x;
}
function flipColors(h) {
  h.color = RED; h.left.color = BLACK; h.right.color = BLACK;
}
function insert(h, val) {
  if (!h) return new RBNode(val);
  if (val < h.val) h.left = insert(h.left, val);
  else h.right = insert(h.right, val);
  // Fix-up: rotate and recolor
  if (isRed(h.right) && !isRed(h.left)) h = rotateLeft(h);
  if (isRed(h.left) && isRed(h.left?.left)) h = rotateRight(h);
  if (isRed(h.left) && isRed(h.right)) flipColors(h);
  return h;
}`,go:`type Color bool
const (Red Color = true; Black Color = false)
type RBNode struct { Val int; Left, Right *RBNode; Color Color }
func isRed(n *RBNode) bool { return n != nil && n.Color == Red }
func rotateLeft(h *RBNode) *RBNode {
    x := h.Right; h.Right = x.Left; x.Left = h
    x.Color = h.Color; h.Color = Red; return x
}
func insert(h *RBNode, val int) *RBNode {
    if h == nil { return &RBNode{Val: val, Color: Red} }
    if val < h.Val { h.Left = insert(h.Left, val) } else { h.Right = insert(h.Right, val) }
    if isRed(h.Right) && !isRed(h.Left) { h = rotateLeft(h) }
    if isRed(h.Left) && isRed(h.Left.Left) { h = rotateRight(h) }
    if isRed(h.Left) && isRed(h.Right) { h.Color = Red; h.Left.Color = Black; h.Right.Color = Black }
    return h
}`,csharp:`public class RBNode {
    public int Val; public RBNode Left, Right;
    public bool IsRed = true;
    public static RBNode Insert(RBNode h, int val) {
        if (h == null) return new RBNode{Val=val};
        if (val < h.Val) h.Left = Insert(h.Left, val);
        else h.Right = Insert(h.Right, val);
        if (IsRed(h.Right) && !IsRed(h.Left)) h = RotateLeft(h);
        if (IsRed(h.Left) && IsRed(h.Left?.Left)) h = RotateRight(h);
        if (IsRed(h.Left) && IsRed(h.Right)) FlipColors(h);
        return h;
    }
    static bool IsRed(RBNode n) => n?.IsRed ?? false;
}`}
};

R['segment-tree']={name:'Segment Tree',group:'tree',defaultInput:'1, 3, 5, 7, 9, 11',
  description:'Segment Tree lưu thông tin các đoạn con của mảng, hỗ trợ truy vấn range (sum, min, max) và cập nhật điểm trong O(log n). Mỗi nút đại diện một đoạn, nút lá là phần tử gốc.',
  complexity:{timeBest:'O(log n)',timeAvg:'O(log n)',timeWorst:'O(log n)',space:'O(n)'},
  pros:['Range query O(log n)','Point update O(log n)','Linh hoạt'],cons:['Tốn 4n bộ nhớ','Cài đặt dài','Overhead cho query đơn giản'],
  useCases:['Range sum/min/max query','Competitive programming','Interval problems'],
  visualize(raw){const arr=parseArrayInput(raw);const steps=[];const n=arr.length;const tree=new Array(4*n).fill(0);
    function build(node,s,e){if(s===e){tree[node]=arr[s];return;}const m=Math.floor((s+e)/2);build(2*node,s,m);build(2*node+1,m+1,e);tree[node]=tree[2*node]+tree[2*node+1];}
    build(1,0,n-1);steps.push({array:arr,highlights:{},description:'Segment Tree built. Root sum = '+tree[1]});
    for(let i=0;i<n;i++){steps.push({array:arr,highlights:{active:[i]},description:`Nút lá: a[${i}]=${arr[i]}`});}
    steps.push({array:arr,highlights:{sorted:Array.from({length:n},(_,i)=>i)},description:'Query range sum(0, '+(n-1)+') = '+tree[1]});
    return steps;},
  render(canvas,step){renderArrayBars(canvas,step.array,step.highlights);},
  code:{javascript:`class SegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n).fill(0);
    this.build(arr, 1, 0, this.n - 1);
  }
  build(arr, node, start, end) {
    if (start === end) { this.tree[node] = arr[start]; return; }
    const mid = Math.floor((start + end) / 2);
    this.build(arr, 2*node, start, mid);
    this.build(arr, 2*node+1, mid+1, end);
    this.tree[node] = this.tree[2*node] + this.tree[2*node+1];
  }
  query(node, start, end, l, r) {
    if (r < start || end < l) return 0;          // Ngoài phạm vi
    if (l <= start && end <= r) return this.tree[node]; // Trong phạm vi
    const mid = Math.floor((start + end) / 2);
    return this.query(2*node, start, mid, l, r) +
           this.query(2*node+1, mid+1, end, l, r);
  }
}`,go:`type SegTree struct { tree []int; n int }
func NewSegTree(arr []int) *SegTree {
    st := &SegTree{n: len(arr), tree: make([]int, 4*len(arr))}
    st.build(arr, 1, 0, st.n-1); return st
}
func (st *SegTree) build(arr []int, node, s, e int) {
    if s == e { st.tree[node] = arr[s]; return }
    m := (s + e) / 2
    st.build(arr, 2*node, s, m)
    st.build(arr, 2*node+1, m+1, e)
    st.tree[node] = st.tree[2*node] + st.tree[2*node+1]
}`,csharp:`public class SegmentTree {
    int[] tree; int n;
    public SegmentTree(int[] arr) {
        n = arr.Length; tree = new int[4 * n];
        Build(arr, 1, 0, n - 1);
    }
    void Build(int[] arr, int node, int s, int e) {
        if (s == e) { tree[node] = arr[s]; return; }
        int m = (s + e) / 2;
        Build(arr, 2*node, s, m); Build(arr, 2*node+1, m+1, e);
        tree[node] = tree[2*node] + tree[2*node+1];
    }
}`}
};

R['trie']={name:'Trie (Prefix Tree)',group:'tree',defaultInput:'cat, car, card, care, bat, bar',
  description:'Trie lưu trữ tập từ theo cấu trúc cây với mỗi cạnh là một ký tự. Cho phép tìm kiếm từ, prefix, autocomplete trong O(m) với m là độ dài từ. Rất hiệu quả cho xử lý chuỗi.',
  complexity:{timeBest:'O(m)',timeAvg:'O(m)',timeWorst:'O(m)',space:'O(ALPHABET·m·n)'},
  pros:['Tìm kiếm O(m)','Autocomplete','Prefix matching'],cons:['Tốn bộ nhớ','Overhead cho tập từ nhỏ'],
  useCases:['Autocomplete','Spell checker','IP routing','Dictionary'],
  visualize(raw){const words=raw.split(/[,\s]+/).map(s=>s.trim()).filter(Boolean);const steps=[];
    steps.push({array:words.map((_,i)=>i+1),highlights:{},description:'Chèn từ vào Trie: '+words.join(', ')});
    words.forEach((w,i)=>{steps.push({array:words.map((_,i)=>i+1),highlights:{active:[i]},description:`Chèn "${w}" — duyệt/tạo nút cho từng ký tự`});});
    steps.push({array:words.map((_,i)=>i+1),highlights:{sorted:words.map((_,i)=>i)},description:'Trie hoàn tất! '+words.length+' từ đã chèn'});
    return steps;},
  render(canvas,step){renderArrayBars(canvas,step.array,step.highlights);},
  code:{javascript:`class TrieNode {
  constructor() { this.children = {}; this.isEnd = false; }
}
class Trie {
  constructor() { this.root = new TrieNode(); }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
    }
    node.isEnd = true;
  }
  search(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return node.isEnd;
  }
  startsWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return true;
  }
}`,go:`type TrieNode struct {
    Children map[rune]*TrieNode
    IsEnd    bool
}
type Trie struct { Root *TrieNode }
func NewTrie() *Trie { return &Trie{Root: &TrieNode{Children: map[rune]*TrieNode{}}} }
func (t *Trie) Insert(word string) {
    node := t.Root
    for _, ch := range word {
        if _, ok := node.Children[ch]; !ok {
            node.Children[ch] = &TrieNode{Children: map[rune]*TrieNode{}}
        }
        node = node.Children[ch]
    }
    node.IsEnd = true
}
func (t *Trie) Search(word string) bool {
    node := t.Root
    for _, ch := range word {
        if _, ok := node.Children[ch]; !ok { return false }
        node = node.Children[ch]
    }
    return node.IsEnd
}`,csharp:`public class Trie {
    Dictionary<char, Trie> children = new();
    bool isEnd;
    public void Insert(string word) {
        var node = this;
        foreach (char ch in word) {
            if (!node.children.ContainsKey(ch))
                node.children[ch] = new Trie();
            node = node.children[ch];
        }
        node.isEnd = true;
    }
    public bool Search(string word) {
        var node = this;
        foreach (char ch in word) {
            if (!node.children.ContainsKey(ch)) return false;
            node = node.children[ch];
        }
        return node.isEnd;
    }
}`}
};

})();

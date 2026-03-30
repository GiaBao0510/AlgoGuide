/* backtracking.js — Backtracking Algorithms */
(function(){
const R = window.AlgoRegistry || (window.AlgoRegistry = {});

function btArrayRender(canvas, step) {
  renderArrayBars(canvas, step.array, step.highlights);
}

function renderBoard(canvas, board, highlights) {
  canvas.innerHTML = '';
  canvas.style.display = 'grid';
  canvas.style.gridTemplateColumns = `repeat(${board.length}, 1fr)`;
  canvas.style.gap = '6px';
  canvas.style.maxWidth = '420px';
  canvas.style.margin = '0 auto';
  board.forEach((hasQueen, idx) => {
    const cell = document.createElement('div');
    cell.style.height = '42px';
    cell.style.border = '1px solid var(--border)';
    cell.style.borderRadius = '8px';
    cell.style.display = 'flex';
    cell.style.alignItems = 'center';
    cell.style.justifyContent = 'center';
    cell.style.background = hasQueen ? 'var(--primary)' : 'var(--bg-input)';
    cell.style.color = hasQueen ? '#fff' : 'var(--text-tertiary)';
    if (highlights && highlights.active && highlights.active.includes(idx)) {
      cell.style.outline = '2px solid var(--primary-light)';
    }
    cell.textContent = hasQueen ? 'Q' : '.';
    canvas.appendChild(cell);
  });
}

R['n-queens'] = {
  name: 'N-Queens (N=4)',
  group: 'backtracking',
  defaultInput: '4',
  description: 'Đặt N quân hậu lên bàn cờ N x N sao cho không quân nào ăn nhau. Backtracking thử và quay lui khi xung đột.',
  complexity: { timeBest: 'O(N!)', timeAvg: 'O(N!)', timeWorst: 'O(N!)', space: 'O(N)' },
  pros: ['Minh họa quay lui tốt', 'Dễ thấy prune'],
  cons: ['Tăng rất nhanh theo N'],
  useCases: ['Constraint solving', 'State-space search'],
  visualize(raw) {
    const n = Math.max(4, Math.min(8, parseInt((raw || '4').trim(), 10) || 4));
    const steps = [];
    const cols = new Set();
    const diag1 = new Set();
    const diag2 = new Set();
    const pos = new Array(n).fill(-1);
    let solved = false;

    function snapshot(row, col, desc) {
      const board = new Array(n * n).fill(false);
      for (let r = 0; r < n; r++) {
        if (pos[r] >= 0) board[r * n + pos[r]] = true;
      }
      const active = row >= 0 && col >= 0 ? [row * n + col] : [];
      steps.push({ board, n, highlights: { active }, description: desc });
    }

    function dfs(row) {
      if (row === n) {
        solved = true;
        snapshot(-1, -1, 'Đã tìm được một nghiệm hợp lệ');
        return;
      }
      for (let c = 0; c < n; c++) {
        snapshot(row, c, `Thử đặt hậu tại hàng ${row}, cột ${c}`);
        if (cols.has(c) || diag1.has(row - c) || diag2.has(row + c)) {
          continue;
        }
        pos[row] = c;
        cols.add(c);
        diag1.add(row - c);
        diag2.add(row + c);
        snapshot(row, c, `Đặt hậu tại hàng ${row}, cột ${c}`);
        dfs(row + 1);
        if (solved) return;
        cols.delete(c);
        diag1.delete(row - c);
        diag2.delete(row + c);
        pos[row] = -1;
        snapshot(row, c, `Quay lui từ hàng ${row}, cột ${c}`);
      }
    }

    dfs(0);
    if (!solved) {
      snapshot(-1, -1, 'Không tìm thấy nghiệm');
    }
    return steps;
  },
  render(canvas, step) {
    renderBoard(canvas, step.board || [], step.highlights || {});
  },
  code: {
    javascript: `function solveNQueens(n) {
  const cols = new Set(), d1 = new Set(), d2 = new Set();
  const pos = new Array(n).fill(-1);
  function dfs(r) {
    if (r === n) return true;
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue;
      pos[r] = c;
      cols.add(c); d1.add(r - c); d2.add(r + c);
      if (dfs(r + 1)) return true;
      cols.delete(c); d1.delete(r - c); d2.delete(r + c);
      pos[r] = -1;
    }
    return false;
  }
  dfs(0);
  return pos;
}`,
    go: `func solveNQueens(n int) []int {
    cols, d1, d2 := map[int]bool{}, map[int]bool{}, map[int]bool{}
    pos := make([]int, n)
    for i := range pos { pos[i] = -1 }
    var dfs func(int) bool
    dfs = func(r int) bool {
        if r == n { return true }
        for c := 0; c < n; c++ {
            if cols[c] || d1[r-c] || d2[r+c] { continue }
            pos[r] = c
            cols[c], d1[r-c], d2[r+c] = true, true, true
            if dfs(r + 1) { return true }
            delete(cols, c); delete(d1, r-c); delete(d2, r+c)
            pos[r] = -1
        }
        return false
    }
    dfs(0)
    return pos
}`,
    csharp: `public static int[] SolveNQueens(int n) {
    var cols = new HashSet<int>();
    var d1 = new HashSet<int>();
    var d2 = new HashSet<int>();
    var pos = Enumerable.Repeat(-1, n).ToArray();
    bool Dfs(int r) {
        if (r == n) return true;
        for (int c = 0; c < n; c++) {
            if (cols.Contains(c) || d1.Contains(r-c) || d2.Contains(r+c)) continue;
            pos[r] = c;
            cols.Add(c); d1.Add(r-c); d2.Add(r+c);
            if (Dfs(r + 1)) return true;
            cols.Remove(c); d1.Remove(r-c); d2.Remove(r+c);
            pos[r] = -1;
        }
        return false;
    }
    Dfs(0);
    return pos;
}`
  }
};

R['subset-sum-backtracking'] = {
  name: 'Subset Sum',
  group: 'backtracking',
  defaultInput: '3, 34, 4, 12, 5, 2 | 9',
  description: 'Tìm tập con có tổng bằng target bằng cách thử chọn hoặc không chọn từng phần tử và quay lui khi cần.',
  complexity: { timeBest: 'O(2^n)', timeAvg: 'O(2^n)', timeWorst: 'O(2^n)', space: 'O(n)' },
  pros: ['Tổng quát', 'Dễ minh họa cây quyết định'],
  cons: ['Tăng nhanh theo n'],
  useCases: ['Partition problems', 'Constraint search'],
  visualize(raw) {
    const parts = (raw || '').split('|');
    const arr = parseArrayInput(parts[0] || '3,34,4,12,5,2');
    const target = parseInt((parts[1] || '9').trim(), 10) || 9;
    const steps = [];
    const chosen = [];
    let done = false;

    function dfs(i, sum) {
      if (done) return;
      steps.push({
        array: [...arr],
        highlights: { found: [...chosen], active: i < arr.length ? [i] : [] },
        description: `Xét i=${i}, tổng hiện tại=${sum}`
      });
      if (sum === target) {
        done = true;
        steps.push({
          array: [...arr],
          highlights: { found: [...chosen] },
          description: `Tìm thấy tập con có tổng ${target}`
        });
        return;
      }
      if (i >= arr.length || sum > target) return;

      chosen.push(i);
      dfs(i + 1, sum + arr[i]);
      chosen.pop();
      dfs(i + 1, sum);
    }

    dfs(0, 0);
    if (!done) {
      steps.push({
        array: [...arr],
        highlights: {},
        description: `Không có tập con nào có tổng ${target}`
      });
    }
    return steps;
  },
  render: btArrayRender,
  code: {
    javascript: `function subsetSum(arr, target) {
  function dfs(i, sum) {
    if (sum === target) return true;
    if (i >= arr.length || sum > target) return false;
    return dfs(i + 1, sum + arr[i]) || dfs(i + 1, sum);
  }
  return dfs(0, 0);
}`,
    go: `func subsetSum(arr []int, target int) bool {
    var dfs func(int, int) bool
    dfs = func(i, sum int) bool {
        if sum == target { return true }
        if i >= len(arr) || sum > target { return false }
        return dfs(i+1, sum+arr[i]) || dfs(i+1, sum)
    }
    return dfs(0, 0)
}`,
    csharp: `public static bool SubsetSum(int[] arr, int target) {
    bool Dfs(int i, int sum) {
        if (sum == target) return true;
        if (i >= arr.Length || sum > target) return false;
        return Dfs(i + 1, sum + arr[i]) || Dfs(i + 1, sum);
    }
    return Dfs(0, 0);
}`
  }
};

})();
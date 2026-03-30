# AlgoGuide

Ứng dụng web mô phỏng thuật toán trực quan, giúp học và ôn tập thuật toán qua mô tả, code mẫu đa ngôn ngữ và phần visualizer tương tác.

## Demo

- Link chạy thật: https://algoguide.netlify.app/

## Tính năng chính

- Danh mục thuật toán theo nhóm: Sorting, Searching, Graph, Tree, Two Pointers, Divide and Conquer, Hashing, Greedy, Backtracking, Math.
- Chuyển tab nội dung theo từng thuật toán:
  - Mô tả và độ phức tạp.
  - Mô phỏng trực quan theo từng bước.
  - Code mẫu JavaScript, Go, C#.
- Điều khiển mô phỏng:
  - Play, pause, next, previous, reset.
  - Tùy chỉnh tốc độ chạy.
  - Tạo dữ liệu ngẫu nhiên.
- Tìm kiếm nhanh thuật toán trong sidebar.
- Hỗ trợ giao diện sáng và tối.
- Responsive cho desktop và mobile.

## Cấu trúc dự án

```text
AlgoGuide/
├── index.html
├── README.md
├── assets/
│   └── favicon.svg
├── components/
│   ├── code-viewer.html
│   ├── sidebar.html
│   └── visualizer.html
├── js/
│   ├── main.js
│   ├── router.js
│   └── algorithms/
│       ├── sorting.js
│       ├── searching.js
│       ├── graph.js
│       ├── tree.js
│       ├── two-pointers.js
│       ├── divide-conquer.js
│       ├── hashing.js
│       ├── greedy.js
│       ├── backtracking.js
│       └── math.js
└── styles/
    ├── main.css
    └── themes.css
```

## Cách chạy local

Vì đây là dự án front-end thuần (HTML/CSS/JS), bạn có thể chạy bằng một static server bất kỳ.

### Cách 1: Dùng VS Code Live Server

1. Mở thư mục dự án trong VS Code.
2. Click chuột phải file `index.html`.
3. Chọn `Open with Live Server`.

### Cách 2: Dùng Python

```bash
python -m http.server 5500
```

Sau đó mở trình duyệt tại:

- http://localhost:5500

## Mục tiêu dự án

- Học thuật toán theo hướng trực quan, dễ hiểu.
- Kết hợp lý thuyết và code thực hành trong cùng một giao diện.
- Tạo nền tảng để mở rộng thêm thuật toán và bài toán mô phỏng.

## Góp ý và mở rộng

- Có thể bổ sung thêm các thuật toán nâng cao như DP, String Matching, Bit Manipulation.
- Có thể thêm bộ input mẫu theo từng thuật toán để kiểm thử nhanh.
- Có thể thêm chức năng lưu lịch sử input và so sánh kết quả giữa các thuật toán.

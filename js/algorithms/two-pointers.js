/* two-pointers.js — 7 Two Pointer / Sliding Window Algorithms */
(function(){
const R = window.AlgoRegistry || (window.AlgoRegistry = {});
function tpRender(canvas,step){renderArrayBars(canvas,step.array,step.highlights);}

R['two-pointers']={name:'Two Pointers',group:'two-pointers',defaultInput:'1, 2, 3, 4, 6, 8, 9 | 10',
  description:'Two Pointers dùng hai con trỏ di chuyển trên mảng đã sắp xếp để tìm cặp thỏa điều kiện. Một trỏ đầu, một trỏ cuối, thu hẹp dần. Giảm O(n²) xuống O(n).',
  complexity:{timeBest:'O(n)',timeAvg:'O(n)',timeWorst:'O(n)',space:'O(1)'},
  pros:['O(n) thay vì O(n²)','Đơn giản','In-place'],cons:['Cần mảng sắp xếp','Chỉ cho bài toán cụ thể'],
  useCases:['Two Sum (sorted)','Palindrome check','Container with most water'],
  visualize(raw){const parts=raw.split('|');const arr=parseArrayInput(parts[0]).sort((a,b)=>a-b);const target=parseInt((parts[1]||'').trim())||arr[0]+arr[arr.length-1];
    const steps=[];let l=0,r=arr.length-1;
    steps.push({array:arr,highlights:{},description:`Tìm cặp có tổng = ${target}`});
    while(l<r){const sum=arr[l]+arr[r];
      steps.push({array:arr,highlights:{active:[l,r]},description:`a[${l}]+a[${r}] = ${arr[l]}+${arr[r]} = ${sum}`});
      if(sum===target){steps.push({array:arr,highlights:{found:[l,r]},description:`✅ Tìm thấy: ${arr[l]}+${arr[r]}=${target}`});return steps;}
      if(sum<target)l++;else r--;}
    steps.push({array:arr,highlights:{},description:'❌ Không tìm thấy'});return steps;},
  render:tpRender,
  code:{javascript:`function twoSum(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;   // Tăng tổng
    else right--;               // Giảm tổng
  }
  return [-1, -1];
}`,go:`func twoSum(arr []int, target int) (int, int) {
    left, right := 0, len(arr)-1
    for left < right {
        sum := arr[left] + arr[right]
        if sum == target { return left, right }
        if sum < target { left++ } else { right-- }
    }
    return -1, -1
}`,csharp:`public static (int,int) TwoSum(int[] arr, int target) {
    int left = 0, right = arr.Length - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return (left, right);
        if (sum < target) left++; else right--;
    }
    return (-1, -1);
}`}
};

R['sliding-window-fixed']={name:'Sliding Window (Fixed)',group:'two-pointers',defaultInput:'2, 1, 5, 1, 3, 2 | 3',
  description:'Sliding Window cố định duy trì cửa sổ kích thước k trượt qua mảng. Tính tổng/max/min trong cửa sổ bằng cách thêm phần tử mới và bỏ phần tử cũ. O(n) thay vì O(n*k).',
  complexity:{timeBest:'O(n)',timeAvg:'O(n)',timeWorst:'O(n)',space:'O(1)'},
  pros:['O(n)','Đơn giản','Tối ưu cho fixed-size window'],cons:['Chỉ cho window cố định'],
  useCases:['Max sum subarray size k','Moving average','DNA sequence analysis'],
  visualize(raw){const parts=raw.split('|');const arr=parseArrayInput(parts[0]);const k=parseInt((parts[1]||'3').trim())||3;
    const steps=[];let sum=0,maxSum=-Infinity,maxStart=0;
    for(let i=0;i<k;i++)sum+=arr[i];maxSum=sum;
    steps.push({array:arr,highlights:{active:Array.from({length:k},(_,i)=>i)},description:`Window [0..${k-1}], sum=${sum}`});
    for(let i=k;i<arr.length;i++){sum+=arr[i]-arr[i-k];
      const win=Array.from({length:k},(_,j)=>i-k+1+j);
      if(sum>maxSum){maxSum=sum;maxStart=i-k+1;}
      steps.push({array:arr,highlights:{active:win,found:sum===maxSum?win:[]},description:`Window [${i-k+1}..${i}], sum=${sum}, max=${maxSum}`});}
    steps.push({array:arr,highlights:{found:Array.from({length:k},(_,i)=>maxStart+i)},description:`Max sum = ${maxSum} tại [${maxStart}..${maxStart+k-1}]`});return steps;},
  render:tpRender,
  code:{javascript:`function maxSumSubarray(arr, k) {
  let sum = 0, maxSum = -Infinity;
  // Tính tổng window đầu tiên
  for (let i = 0; i < k; i++) sum += arr[i];
  maxSum = sum;
  // Trượt window
  for (let i = k; i < arr.length; i++) {
    sum += arr[i] - arr[i - k]; // Thêm mới, bỏ cũ
    maxSum = Math.max(maxSum, sum);
  }
  return maxSum;
}`,go:`func maxSumSubarray(arr []int, k int) int {
    sum := 0
    for i := 0; i < k; i++ { sum += arr[i] }
    maxSum := sum
    for i := k; i < len(arr); i++ {
        sum += arr[i] - arr[i-k]
        if sum > maxSum { maxSum = sum }
    }
    return maxSum
}`,csharp:`public static int MaxSumSubarray(int[] arr, int k) {
    int sum = 0;
    for (int i = 0; i < k; i++) sum += arr[i];
    int maxSum = sum;
    for (int i = k; i < arr.Length; i++) {
        sum += arr[i] - arr[i - k];
        maxSum = Math.Max(maxSum, sum);
    }
    return maxSum;
}`}
};

R['sliding-window-dynamic']={name:'Sliding Window (Dynamic)',group:'two-pointers',defaultInput:'2, 3, 1, 2, 4, 3 | 7',
  description:'Sliding Window động mở rộng/thu hẹp cửa sổ theo điều kiện. Dùng cho bài toán "subarray nhỏ nhất có tổng ≥ target". Hai con trỏ left/right, right mở rộng, left thu hẹp.',
  complexity:{timeBest:'O(n)',timeAvg:'O(n)',timeWorst:'O(n)',space:'O(1)'},
  pros:['O(n)','Linh hoạt kích thước','Tối ưu'],cons:['Cần hiểu khi nào mở rộng/thu hẹp'],
  useCases:['Minimum size subarray sum','Longest substring without repeat','Minimum window substring'],
  visualize(raw){const parts=raw.split('|');const arr=parseArrayInput(parts[0]);const target=parseInt((parts[1]||'7').trim())||7;
    const steps=[];let l=0,sum=0,minLen=Infinity,bestL=0,bestR=0;
    steps.push({array:arr,highlights:{},description:`Tìm subarray ngắn nhất có tổng ≥ ${target}`});
    for(let r=0;r<arr.length;r++){sum+=arr[r];
      steps.push({array:arr,highlights:{active:Array.from({length:r-l+1},(_,i)=>l+i)},description:`Mở rộng: window [${l}..${r}], sum=${sum}`});
      while(sum>=target){if(r-l+1<minLen){minLen=r-l+1;bestL=l;bestR=r;}
        steps.push({array:arr,highlights:{found:Array.from({length:r-l+1},(_,i)=>l+i)},description:`Sum=${sum}≥${target}, len=${r-l+1}, thu hẹp`});
        sum-=arr[l];l++;}}
    if(minLen===Infinity)steps.push({array:arr,highlights:{},description:'❌ Không tìm thấy'});
    else steps.push({array:arr,highlights:{found:Array.from({length:bestR-bestL+1},(_,i)=>bestL+i)},description:`✅ Min length = ${minLen}: [${bestL}..${bestR}]`});
    return steps;},
  render:tpRender,
  code:{javascript:`function minSubArrayLen(target, arr) {
  let left = 0, sum = 0, minLen = Infinity;
  for (let right = 0; right < arr.length; right++) {
    sum += arr[right]; // Mở rộng
    while (sum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      sum -= arr[left]; // Thu hẹp
      left++;
    }
  }
  return minLen === Infinity ? 0 : minLen;
}`,go:`func minSubArrayLen(target int, arr []int) int {
    left, sum, minLen := 0, 0, len(arr)+1
    for right := 0; right < len(arr); right++ {
        sum += arr[right]
        for sum >= target {
            if right-left+1 < minLen { minLen = right-left+1 }
            sum -= arr[left]; left++
        }
    }
    if minLen > len(arr) { return 0 }
    return minLen
}`,csharp:`public static int MinSubArrayLen(int target, int[] arr) {
    int left = 0, sum = 0, minLen = int.MaxValue;
    for (int right = 0; right < arr.Length; right++) {
        sum += arr[right];
        while (sum >= target) {
            minLen = Math.Min(minLen, right - left + 1);
            sum -= arr[left++];
        }
    }
    return minLen == int.MaxValue ? 0 : minLen;
}`}
};

R['fast-slow-pointers']={name:'Fast & Slow Pointers',group:'two-pointers',defaultInput:'3, 2, 0, -4',
  description:'Fast & Slow Pointers (Floyd\'s Tortoise and Hare): con trỏ nhanh đi 2 bước, chậm đi 1 bước. Nếu có cycle, chúng sẽ gặp nhau. Dùng phát hiện cycle trong linked list.',
  complexity:{timeBest:'O(n)',timeAvg:'O(n)',timeWorst:'O(n)',space:'O(1)'},
  pros:['O(1) space','Phát hiện cycle','Tìm middle element'],cons:['Chỉ cho linked list/sequence'],
  useCases:['Detect cycle in linked list','Find middle of list','Happy number'],
  visualize(raw){const arr=parseArrayInput(raw);const steps=[];const n=arr.length;
    steps.push({array:arr,highlights:{},description:'Fast & Slow Pointers demo'});
    let slow=0,fast=0;
    for(let i=0;i<n&&fast<n;i++){
      steps.push({array:arr,highlights:{active:[slow],comparing:[Math.min(fast,n-1)]},description:`slow=${slow}, fast=${fast}`});
      slow++;fast+=2;}
    steps.push({array:arr,highlights:{found:[Math.floor(n/2)]},description:`Middle element: index ${Math.floor(n/2)}`});return steps;},
  render:tpRender,
  code:{javascript:`function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;       // 1 bước
    fast = fast.next.next;  // 2 bước
    if (slow === fast) return true; // Cycle detected
  }
  return false;
}
function findMiddle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow; // slow ở giữa
}`,go:`func hasCycle(head *ListNode) bool {
    slow, fast := head, head
    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
        if slow == fast { return true }
    }
    return false
}`,csharp:`public static bool HasCycle(ListNode head) {
    var slow = head; var fast = head;
    while (fast?.Next != null) {
        slow = slow.Next;
        fast = fast.Next.Next;
        if (slow == fast) return true;
    }
    return false;
}`}
};

R['dutch-national-flag']={name:'Dutch National Flag',group:'two-pointers',defaultInput:'2, 0, 1, 2, 0, 1, 1, 0, 2',
  description:'Dutch National Flag (3-way partition): sắp xếp mảng chỉ chứa 0, 1, 2 trong O(n) một lần duyệt. Dùng 3 con trỏ: low, mid, high. Đưa 0 về đầu, 2 về cuối, 1 ở giữa.',
  complexity:{timeBest:'O(n)',timeAvg:'O(n)',timeWorst:'O(n)',space:'O(1)'},
  pros:['O(n) một lần duyệt','In-place','Hiệu quả cho 3 giá trị'],cons:['Chỉ cho 3 giá trị phân biệt'],
  useCases:['Sort colors (LeetCode 75)','3-way partition','QuickSort improvement'],
  visualize(raw){const arr=parseArrayInput(raw);const steps=[];const a=[...arr];let lo=0,mid=0,hi=a.length-1;
    steps.push({array:[...a],highlights:{},description:'Dutch National Flag: 0→đầu, 1→giữa, 2→cuối'});
    while(mid<=hi){
      if(a[mid]===0){[a[lo],a[mid]]=[a[mid],a[lo]];lo++;mid++;
        steps.push({array:[...a],highlights:{found:[lo-1],active:[mid-1]},description:`a[mid]=0 → swap với lo=${lo-1}`});}
      else if(a[mid]===1){mid++;
        steps.push({array:[...a],highlights:{active:[mid-1]},description:`a[mid]=1 → mid++`});}
      else{[a[mid],a[hi]]=[a[hi],a[mid]];hi--;
        steps.push({array:[...a],highlights:{comparing:[hi+1],active:[mid]},description:`a[mid]=2 → swap với hi=${hi+1}`});}}
    steps.push({array:[...a],highlights:{sorted:Array.from({length:a.length},(_,i)=>i)},description:'Hoàn tất!'});return steps;},
  render:tpRender,
  code:{javascript:`function dutchFlag(arr) {
  let lo = 0, mid = 0, hi = arr.length - 1;
  while (mid <= hi) {
    if (arr[mid] === 0) {
      [arr[lo], arr[mid]] = [arr[mid], arr[lo]];
      lo++; mid++;
    } else if (arr[mid] === 1) {
      mid++;
    } else {
      [arr[mid], arr[hi]] = [arr[hi], arr[mid]];
      hi--;
    }
  }
}`,go:`func dutchFlag(arr []int) {
    lo, mid, hi := 0, 0, len(arr)-1
    for mid <= hi {
        switch arr[mid] {
        case 0: arr[lo], arr[mid] = arr[mid], arr[lo]; lo++; mid++
        case 1: mid++
        case 2: arr[mid], arr[hi] = arr[hi], arr[mid]; hi--
        }
    }
}`,csharp:`public static void DutchFlag(int[] arr) {
    int lo = 0, mid = 0, hi = arr.Length - 1;
    while (mid <= hi) {
        if (arr[mid] == 0) { (arr[lo], arr[mid]) = (arr[mid], arr[lo]); lo++; mid++; }
        else if (arr[mid] == 1) mid++;
        else { (arr[mid], arr[hi]) = (arr[hi], arr[mid]); hi--; }
    }
}`}
};

R['three-sum']={name:'3Sum',group:'two-pointers',defaultInput:'-1, 0, 1, 2, -1, -4',
  description:'3Sum tìm tất cả bộ ba có tổng bằng 0. Sắp xếp mảng, cố định phần tử i, dùng two pointers cho phần còn lại. Bỏ qua duplicate. O(n²) thay vì O(n³).',
  complexity:{timeBest:'O(n²)',timeAvg:'O(n²)',timeWorst:'O(n²)',space:'O(1)'},
  pros:['O(n²) từ O(n³)','Loại duplicate','Kết hợp sort + two pointers'],cons:['Vẫn O(n²)','Cần sắp xếp'],
  useCases:['LeetCode 15','Computational geometry','Finding triplets'],
  visualize(raw){const arr=parseArrayInput(raw).sort((a,b)=>a-b);const steps=[];const results=[];
    steps.push({array:arr,highlights:{},description:'3Sum: tìm bộ ba có tổng = 0'});
    for(let i=0;i<arr.length-2;i++){if(i>0&&arr[i]===arr[i-1])continue;let l=i+1,r=arr.length-1;
      while(l<r){const sum=arr[i]+arr[l]+arr[r];
        steps.push({array:arr,highlights:{pivot:i,active:[l,r]},description:`i=${i}(${arr[i]}), l=${l}(${arr[l]}), r=${r}(${arr[r]}), sum=${sum}`});
        if(sum===0){results.push([arr[i],arr[l],arr[r]]);
          steps.push({array:arr,highlights:{found:[i,l,r]},description:`✅ [${arr[i]},${arr[l]},${arr[r]}]`});
          while(l<r&&arr[l]===arr[l+1])l++;while(l<r&&arr[r]===arr[r-1])r--;l++;r--;}
        else if(sum<0)l++;else r--;}}
    steps.push({array:arr,highlights:{},description:`Tìm được ${results.length} bộ ba`});return steps;},
  render:tpRender,
  code:{javascript:`function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i-1]) continue; // Skip duplicate
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left+1]) left++;
        while (left < right && nums[right] === nums[right-1]) right--;
        left++; right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}`,go:`func threeSum(nums []int) [][]int {
    sort.Ints(nums)
    result := [][]int{}
    for i := 0; i < len(nums)-2; i++ {
        if i > 0 && nums[i] == nums[i-1] { continue }
        left, right := i+1, len(nums)-1
        for left < right {
            sum := nums[i] + nums[left] + nums[right]
            if sum == 0 {
                result = append(result, []int{nums[i], nums[left], nums[right]})
                for left < right && nums[left] == nums[left+1] { left++ }
                for left < right && nums[right] == nums[right-1] { right-- }
                left++; right--
            } else if sum < 0 { left++ } else { right-- }
        }
    }
    return result
}`,csharp:`public static IList<IList<int>> ThreeSum(int[] nums) {
    Array.Sort(nums);
    var result = new List<IList<int>>();
    for (int i = 0; i < nums.Length - 2; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue;
        int left = i+1, right = nums.Length-1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) {
                result.Add(new List<int>{nums[i],nums[left],nums[right]});
                while (left < right && nums[left] == nums[left+1]) left++;
                while (left < right && nums[right] == nums[right-1]) right--;
                left++; right--;
            } else if (sum < 0) left++; else right--;
        }
    }
    return result;
}`}
};

R['trapping-rain-water']={name:'Trapping Rain Water',group:'two-pointers',defaultInput:'0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1',
  description:'Tính lượng nước mưa giữ được giữa các cột. Dùng two pointers từ hai đầu, theo dõi max trái và max phải. Nước tại mỗi vị trí = min(maxLeft, maxRight) - height[i].',
  complexity:{timeBest:'O(n)',timeAvg:'O(n)',timeWorst:'O(n)',space:'O(1)'},
  pros:['O(n) time, O(1) space','Trực quan','Classic problem'],cons:['Cần hiểu logic 2 con trỏ'],
  useCases:['LeetCode 42','Histogram problems','Water container problems'],
  visualize(raw){const arr=parseArrayInput(raw);const steps=[];let l=0,r=arr.length-1,lMax=0,rMax=0,water=0;
    steps.push({array:arr,highlights:{},description:'Trapping Rain Water'});
    while(l<r){
      if(arr[l]<arr[r]){if(arr[l]>=lMax)lMax=arr[l];else{water+=lMax-arr[l];
        steps.push({array:arr,highlights:{active:[l],comparing:[r]},description:`water+=${lMax}-${arr[l]}=${lMax-arr[l]}, total=${water}`});}l++;}
      else{if(arr[r]>=rMax)rMax=arr[r];else{water+=rMax-arr[r];
        steps.push({array:arr,highlights:{active:[r],comparing:[l]},description:`water+=${rMax}-${arr[r]}=${rMax-arr[r]}, total=${water}`});}r--;}}
    steps.push({array:arr,highlights:{sorted:Array.from({length:arr.length},(_,i)=>i)},description:`Tổng nước = ${water}`});return steps;},
  render:tpRender,
  code:{javascript:`function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0, water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else water += leftMax - height[left]; // Nước giữ được
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else water += rightMax - height[right];
      right--;
    }
  }
  return water;
}`,go:`func trap(height []int) int {
    left, right := 0, len(height)-1
    leftMax, rightMax, water := 0, 0, 0
    for left < right {
        if height[left] < height[right] {
            if height[left] >= leftMax { leftMax = height[left] } else { water += leftMax - height[left] }
            left++
        } else {
            if height[right] >= rightMax { rightMax = height[right] } else { water += rightMax - height[right] }
            right--
        }
    }
    return water
}`,csharp:`public static int Trap(int[] height) {
    int left = 0, right = height.Length - 1;
    int leftMax = 0, rightMax = 0, water = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) leftMax = height[left];
            else water += leftMax - height[left];
            left++;
        } else {
            if (height[right] >= rightMax) rightMax = height[right];
            else water += rightMax - height[right];
            right--;
        }
    }
    return water;
}`}
};

})();

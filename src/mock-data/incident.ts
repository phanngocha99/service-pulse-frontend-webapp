export type Priority = "P1" | "P2" | "P3" | "P4";
export type Status = "New" | "In Progress" | "On Hold" | "Resolved" | "Closed";

export interface HistoryEntry {
  time: string;
  user: string;
  field: string;
  from: string;
  to: string;
}

export interface ThreadMessage {
  author: string;
  message: string;
  time: string;
  isWorknote: boolean;
}

export interface TicketData {
  id: string;
  title: string;
  priority: Priority;
  status: Status;
  category: string;
  requester: string;
  requesterEmail: string;
  impact: string;
  urgency: string;
  assignee: string;
  group: string;
  slaDeadline: number;
  description: string;
  thread: ThreadMessage[];
  history: HistoryEntry[];
}

export const mockTickets: TicketData[] = [
  {
    id: "INC001",
    title: "Laptop không kết nối Wi-Fi",
    priority: "P2",
    status: "In Progress",
    category: "Network > Wi-Fi",
    requester: "Nguyen Van A",
    requesterEmail: "nva@company.com",
    impact: "Medium",
    urgency: "Medium",
    assignee: "Tran IT Support",
    group: "Network Team",
    slaDeadline: 45,
    description:
      "Laptop Dell Latitude không thể kết nối Wi-Fi sau khi cập nhật Windows.",
    thread: [
      {
        author: "Nguyen Van A",
        message: "Laptop không kết nối Wi-Fi sau khi restart.",
        time: "Mar 28, 10:00",
        isWorknote: false,
      },
      {
        author: "Tran IT Support",
        message:
          "Checked DHCP logs - client not getting IP. Possible driver issue.",
        time: "Mar 28, 11:00",
        isWorknote: true,
      },
      {
        author: "Tran IT Support",
        message: "Vui lòng thử cập nhật driver qua Device Manager.",
        time: "Mar 28, 11:30",
        isWorknote: false,
      },
      {
        author: "Admin",
        message:
          "Similar issue reported by 3 other users in Building A. Could be AP issue.",
        time: "Mar 28, 12:00",
        isWorknote: true,
      },
    ],
    history: [
      {
        time: "Mar 28 10:00",
        user: "System",
        field: "Status",
        from: "-",
        to: "New",
      },
      {
        time: "Mar 28 10:05",
        user: "Auto-Assign",
        field: "Group",
        from: "-",
        to: "Network Team",
      },
      {
        time: "Mar 28 10:30",
        user: "Tran IT",
        field: "Status",
        from: "New",
        to: "In Progress",
      },
      {
        time: "Mar 28 10:30",
        user: "Tran IT",
        field: "Assignee",
        from: "-",
        to: "Tran IT Support",
      },
      {
        time: "Mar 28 11:00",
        user: "Tran IT",
        field: "Priority",
        from: "P3",
        to: "P2",
      },
    ],
  },
  {
    id: "INC005",
    title: "SAP ERP login bị lỗi 500",
    priority: "P1",
    status: "New",
    category: "Software > ERP",
    requester: "Le Thi B",
    requesterEmail: "ltb@company.com",
    impact: "High",
    urgency: "High",
    assignee: "",
    group: "Application Team",
    slaDeadline: 12,
    description: "Toàn bộ phòng kế toán không thể đăng nhập SAP. Lỗi HTTP 500.",
    thread: [
      {
        author: "Le Thi B",
        message: "SAP hiện lỗi 500 cho toàn bộ team kế toán.",
        time: "Mar 28, 14:00",
        isWorknote: false,
      },
    ],
    history: [
      {
        time: "Mar 28 14:00",
        user: "System",
        field: "Status",
        from: "-",
        to: "New",
      },
      {
        time: "Mar 28 14:01",
        user: "System",
        field: "Priority",
        from: "-",
        to: "P1",
      },
    ],
  },
  {
    id: "INC006",
    title: "Máy in tầng 5 không hoạt động",
    priority: "P4",
    status: "On Hold",
    category: "Hardware > Printer",
    requester: "Pham Van C",
    requesterEmail: "pvc@company.com",
    impact: "Low",
    urgency: "Low",
    assignee: "Nguyen Support",
    group: "Desktop Team",
    slaDeadline: 480,
    description: "Máy in HP LaserJet tầng 5 không in được, đèn đỏ nhấp nháy.",
    thread: [
      {
        author: "Pham Van C",
        message: "Máy in tầng 5 bị lỗi.",
        time: "Mar 27, 16:00",
        isWorknote: false,
      },
      {
        author: "Nguyen Support",
        message: "Fuser unit bị hỏng. Đã order part #RM1-8395.",
        time: "Mar 28, 08:30",
        isWorknote: true,
      },
      {
        author: "Nguyen Support",
        message: "Đã đặt linh kiện thay thế, ETA 2 ngày.",
        time: "Mar 28, 09:00",
        isWorknote: false,
      },
    ],
    history: [
      {
        time: "Mar 27 16:00",
        user: "System",
        field: "Status",
        from: "-",
        to: "New",
      },
      {
        time: "Mar 28 08:30",
        user: "Nguyen",
        field: "Status",
        from: "In Progress",
        to: "On Hold",
      },
    ],
  },
  {
    id: "INC101",
    title: "Outlook không gửi được email",
    priority: "P3",
    status: "In Progress",
    category: "Software > Email",
    requester: "You",
    requesterEmail: "you@company.com",
    impact: "Medium",
    urgency: "Medium",
    assignee: "Tran IT Support",
    group: "Application Team",
    slaDeadline: 120,
    description:
      "Email gửi đi bị kẹt ở Outbox, không nhận được phản hồi từ server.",
    thread: [
      {
        author: "You",
        message: "Outlook không gửi email được từ sáng.",
        time: "Mar 28, 09:15",
        isWorknote: false,
      },
      {
        author: "Tran IT Support",
        message: "Đang kiểm tra cấu hình SMTP, vui lòng chờ.",
        time: "Mar 28, 10:00",
        isWorknote: false,
      },
    ],
    history: [
      {
        time: "Mar 28 09:15",
        user: "System",
        field: "Status",
        from: "-",
        to: "New",
      },
      {
        time: "Mar 28 10:00",
        user: "Tran IT",
        field: "Status",
        from: "New",
        to: "In Progress",
      },
    ],
  },
  {
    id: "INC102",
    title: "VPN kết nối chập chờn",
    priority: "P2",
    status: "New",
    category: "Network > VPN",
    requester: "You",
    requesterEmail: "you@company.com",
    impact: "Medium",
    urgency: "High",
    assignee: "",
    group: "Network Team",
    slaDeadline: 60,
    description:
      "VPN liên tục disconnect khi làm việc remote, ảnh hưởng đến công việc.",
    thread: [
      {
        author: "You",
        message: "VPN bị rớt mỗi 10 phút.",
        time: "Mar 28, 08:00",
        isWorknote: false,
      },
    ],
    history: [
      {
        time: "Mar 28 08:00",
        user: "System",
        field: "Status",
        from: "-",
        to: "New",
      },
    ],
  },
  {
    id: "INC103",
    title: "Yêu cầu cấp quyền SharePoint",
    priority: "P4",
    status: "Resolved",
    category: "Access > Permission Request",
    requester: "You",
    requesterEmail: "you@company.com",
    impact: "Low",
    urgency: "Low",
    assignee: "Admin Team",
    group: "Access Team",
    slaDeadline: 1440,
    description: "Cần quyền truy cập SharePoint folder 'Project Alpha'.",
    thread: [
      {
        author: "You",
        message: "Cần quyền truy cập SharePoint folder 'Project Alpha'.",
        time: "Mar 23, 09:00",
        isWorknote: false,
      },
      {
        author: "Admin Team",
        message: "Đã cấp quyền. Vui lòng kiểm tra.",
        time: "Mar 23, 11:00",
        isWorknote: false,
      },
    ],
    history: [
      {
        time: "Mar 23 09:00",
        user: "System",
        field: "Status",
        from: "-",
        to: "New",
      },
      {
        time: "Mar 23 11:00",
        user: "Admin",
        field: "Status",
        from: "In Progress",
        to: "Resolved",
      },
    ],
  },
  {
    id: "INC104",
    title: "Màn hình ngoài không hiển thị",
    priority: "P3",
    status: "Closed",
    category: "Hardware > Monitor",
    requester: "You",
    requesterEmail: "you@company.com",
    impact: "Low",
    urgency: "Medium",
    assignee: "Desktop Team",
    group: "Desktop Team",
    slaDeadline: 240,
    description: "Màn hình ngoài Dell U2419H không nhận tín hiệu HDMI.",
    thread: [
      {
        author: "You",
        message: "Màn hình ngoài không lên hình.",
        time: "Mar 20, 14:00",
        isWorknote: false,
      },
      {
        author: "Desktop Team",
        message: "Đã thay cáp HDMI mới. Vui lòng kiểm tra.",
        time: "Mar 21, 10:00",
        isWorknote: false,
      },
    ],
    history: [
      {
        time: "Mar 20 14:00",
        user: "System",
        field: "Status",
        from: "-",
        to: "New",
      },
      {
        time: "Mar 21 10:00",
        user: "Desktop Team",
        field: "Status",
        from: "In Progress",
        to: "Resolved",
      },
      {
        time: "Mar 22 10:00",
        user: "System",
        field: "Status",
        from: "Resolved",
        to: "Closed",
      },
    ],
  },
];

export const priorityColors: Record<Priority, string> = {
  P1: "bg-sla-breached text-primary-foreground",
  P2: "bg-sla-near text-primary-foreground",
  P3: "bg-info text-info-foreground",
  P4: "bg-muted text-muted-foreground",
};

export const statusSteps: Status[] = [
  "New",
  "In Progress",
  "On Hold",
  "Resolved",
  "Closed",
];

export const incidentQueues = [
  {
    slug: "my-group",
    label: "My Group's Tickets",
    description: "Tickets assigned to your group",
  },
  {
    slug: "unassigned",
    label: "Unassigned",
    description: "Tickets waiting for an assignee",
  },
  {
    slug: "breaching",
    label: "Breaching Soon",
    description: "SLA at risk within 1 hour",
  },
  {
    slug: "all",
    label: "All Incidents",
    description: "Browse every incident in the system",
  },
];

import { TeamOutlined } from "@ant-design/icons";
import UsersPage from "pages/usersTable";
// ... other imports

const routes = [
  // ... other routes
  {
    path: "/users",
    element: <UsersPage />,
    name: "Users",
    icon: <TeamOutlined />,
  },
];

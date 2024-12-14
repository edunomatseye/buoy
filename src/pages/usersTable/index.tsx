import React from "react";
import { Table, Input, Space, Avatar, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { UsersApiService, User } from "../../services/users/api";
import type { ColumnsType, ColumnType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import type { FilterConfirmProps } from "antd/es/table/interface";

const UsersPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => UsersApiService.getInstance().getUsers(),
  });

  const getColumnSearchProps = (dataIndex: keyof User) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: {
      setSelectedKeys: (keys: string[]) => void;
      selectedKeys: string[];
      confirm: (param?: FilterConfirmProps) => void;
      clearFilters: () => void;
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <button
            type="button"
            onClick={() => {
              confirm();
            }}
            style={{ width: 90 }}
          >
            Search
          </button>
          <button
            onClick={() => {
              clearFilters();
              confirm();
            }}
            style={{ width: 90 }}
          >
            Reset
          </button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: string | number | boolean, record: User) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
  });

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      ...(getColumnSearchProps("firstName") as ColumnType<User>),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      ...(getColumnSearchProps("lastName") as ColumnType<User>),
    },
    {
      title: "Name",
      key: "fullName",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image, record) => (
        // Using Avatar component because:
        // 1. Built-in lazy loading
        // 2. Handles failed image loads gracefully
        // 3. Shows user initials as fallback
        // 4. Consistent circular design that looks professional
        <Avatar
          src={image}
          size={40}
          alt={`${record.firstName} ${record.lastName}`}
        >
          {record.firstName[0]}
        </Avatar>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Table
        columns={columns}
        dataSource={data?.users}
        rowKey="id"
        pagination={{
          pageSize: 13,
          showSizeChanger: false,
        }}
      />
    </div>
  );
};

export default UsersPage;

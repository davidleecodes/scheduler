import React, { useState } from "react";

import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Layout,
  Menu,
  theme,
  Button,
  Flex,
  Input,
  Empty,
  Popconfirm,
} from "antd";

const { Header, Content, Footer, Sider } = Layout;

const ListNavContiner = ({
  collection,
  onAddItem,
  addLabel,
  children,
  selectedId,
  setSelectedId,
  deleteLabel,
  onDeleteItem,
}) => {
  const [newItemName, setNewItemName] = useState("");

  const handleAddToCollection = () => {
    const data = { name: newItemName };
    onAddItem(data);
    setNewItemName("");
  };
  const {
    token: { colorBgContainer, borderRadiusSM },
  } = theme.useToken();

  const items = Object.entries(collection).map(([id, data]) => ({
    key: id,
    icon: React.createElement(UserOutlined),
    label: data.name,
  }));
  const [collapsed, setCollapsed] = useState(false);
  const confirm = (e) => {
    onDeleteItem(selectedId);
  };
  return (
    <>
      <Layout>
        <Sider
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="lg"
          collapsedWidth="0"
          theme="light"
        >
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={items}
            selectedKeys={[selectedId]}
            onClick={({ key }) => setSelectedId(key)}
          />
          <Flex
            align="center"
            gap="small"
            style={{
              margin: 4,
              position: collapsed ? "relative" : "absolute",
              bottom: 0,
            }}
          >
            <Input
              placeholder={addLabel}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <Button
              onClick={handleAddToCollection}
              disabled={!newItemName}
              icon={<PlusOutlined />}
              shape="circle"
              type="primary"
              size="small"
            />
          </Flex>
        </Sider>
        <Layout>
          <Header />
          <Content style={{ margin: "24px 16px 0" }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusSM,
              }}
            >
              {!children && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
              {children}
            </div>
          </Content>
          <Footer style={{ margin: "24px 16px ", padding: 0 }}>
            <Flex justify="flex-end">
              <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this task?"
                onConfirm={confirm}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary">{deleteLabel}</Button>
              </Popconfirm>
            </Flex>
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default ListNavContiner;

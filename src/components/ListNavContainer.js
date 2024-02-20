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

const { Search } = Input;

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
  isSimple,
}) => {
  const {
    token: { colorBgContainer, borderRadiusSM },
  } = theme.useToken();

  const [newItemName, setNewItemName] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const items = Object.entries(collection).map(([id, data]) => ({
    key: id,
    icon: React.createElement(UserOutlined),
    label: data.name,
  }));

  const [filteredItems, setFilteredItems] = useState(items);

  const handleAddToCollection = () => {
    const data = { name: newItemName };
    onAddItem(data);
    setNewItemName("");
  };

  const confirm = (e) => {
    onDeleteItem(selectedId);
  };

  const onSearch = (value) => {
    let filtered = items.filter((item) => item.label.includes(value));
    setFilteredItems(filtered);
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
          {!isSimple && (
            <Search
              placeholder="search"
              allowClear
              onSearch={onSearch}
              style={{
                padding: "0 4px",
              }}
            />
          )}
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={filteredItems}
            selectedKeys={[selectedId]}
            onClick={({ key }) => setSelectedId(key)}
          />
          {!isSimple && (
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
          )}
        </Sider>
        <Layout>
          <Header />
          <Content style={{ margin: "12px 8px 0" }}>
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
          <Footer style={{ margin: "12px 8px ", padding: 0 }}>
            {!isSimple && (
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
            )}
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default ListNavContiner;

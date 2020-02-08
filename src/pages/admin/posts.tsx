import React, { ComponentProps } from 'react';
import router from 'umi/router';

import PostList from '@/components/post_list';

import { adminPosts } from '@/utils/api';
import { Card, Table, Button, Row, Col, Icon } from 'antd';
import Container from '@/components/container';
import { SorterResult, PaginationConfig, ColumnProps } from 'antd/es/table';
import { TableCurrentDataSource } from 'antd/lib/table';

import Link from 'umi/link';
import TagPart from '@/components/tag';

interface T extends Blotter.PostCard {}

interface AdminPostListProps extends ComponentProps<'base'> {}

interface AdminPostListState {
  loading: boolean;
  pagination: PaginationConfig;
  data: T[];
  total: number;
  size: number;
  page: number;
}

class AdminPostList extends React.Component<AdminPostListProps, AdminPostListState> {
  static defaultProps: AdminPostListProps = {};

  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      pagination: {},
      data: [],
      total: 0,
      size: 10,
      page: 0,
    };
    this.getData(1, 10, 'publish_time', false);
  }

  getData = async (page: number, size: number, field: string, up: boolean) => {
    this.setState({ loading: true });
    var r = await adminPosts(page, size, field, up);
    this.setState({ data: r.posts, total: r.total, loading: false });
  };

  columns: ColumnProps<T>[] = [
    {
      title: '标题',
      key: 'title',
      dataIndex: 'title',
      render: (text, record, index) => <Link to={`/post/${record.url}`}>{record.title}</Link>,
      width: '20%',
    },
    {
      title: '链接',
      key: 'url',
      dataIndex: 'url',
      width: '10%',
    },
    {
      title: '发布时间',
      key: 'publish_time',
      dataIndex: 'publish_time',
      sorter: true,
      width: '10%',
    },
    {
      title: '编辑时间',
      key: 'edit_time',
      dataIndex: 'edit_time',
      sorter: true,
      width: '10%',
    },
    {
      title: '阅读量',
      key: 'view',
      dataIndex: 'view',
      sorter: true,
      width: '10%',
    },
    {
      title: '标签',
      key: 'tags',
      dataIndex: 'tags',
      width: '20%',
      render: (text, record, index) => (
        <div>
          {record.tags.map(tag => (
            <TagPart key={tag.short} tag={tag} />
          ))}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'op',
      width: '20%',
      render: (text, record, index) => (
        <Row gutter={5}>
          <Col span={12}>
            <Link to={`/admin/post?url=${record.url}`}>
              <Button>
                <Icon type="edit" />
                编辑
              </Button>
            </Link>
          </Col>
          <Col span={12}>
            <Button type="danger">
              <Icon type="delete" />
              删除
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  onTableChange = (
    pagination: PaginationConfig,
    filters: Partial<Record<keyof T, string[]>>,
    sorter: SorterResult<T>,
    extra: TableCurrentDataSource<T>,
  ) => {
    const { current, pageSize } = pagination;
    const { field, order } = sorter;
    this.setState({
      page: current!,
      size: pageSize!,
    });
    var defaultSort = typeof order === 'undefined';

    this.getData(
      current!,
      pageSize!,
      defaultSort ? 'publish_time' : field,
      defaultSort ? false : order === 'ascend',
    );
  };

  render() {
    return (
      <Container lg={20} md={20} sm={24} xs={24}>
        <Card>
          <div style={{ textAlign: 'right' }}>
            <Link to="/admin/post">
              <Button type="primary">
                <Icon type="plus" />
                新建文章
              </Button>
            </Link>
          </div>

          <Table<T>
            columns={this.columns}
            dataSource={this.state.data}
            loading={this.state.loading}
            onChange={this.onTableChange}
            pagination={{
              current: this.state.page,
              total: this.state.total,
              pageSize: this.state.size,
              showSizeChanger: true,
            }}
          />
        </Card>
      </Container>
    );
  }
}

export default AdminPostList;
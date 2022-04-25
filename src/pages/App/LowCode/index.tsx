/* eslint-disable @iceworks/best-practices/no-http-url */
import ProTable, { ProColumns, TableDropdown } from '@ant-design/pro-table';
import { Button, Card, Form, message, Modal, Popconfirm } from 'antd';
import { request, history } from 'ice';
// import { CreatePage} from 'widgets';

interface GithubIssueItem {
  id: number;
  url: string;
  pageName: string;
  description: string;
  createTime: string;
  creator: string;
  updateTime: string;
  updater: string;
  state: number;
}

const REST_API = 'http://localhost:8112/@robber/devPage';

const columns: Array<ProColumns<GithubIssueItem>> = [
  {
    title: 'ID',
    dataIndex: 'id',
    copyable: true,
    align: 'center',
    search: false,
    hideInForm: true,
  },
  {
    title: '页面名称',
    dataIndex: 'name',
    align: 'center',
    copyable: true,
    search: false,
  },
  {
    title: '页面名称',
    dataIndex: 'name:fuzzy',
    align: 'center',
    hideInForm: true,
    hideInTable: true,
  },
  {
    title: '路由',
    dataIndex: 'path',
    align: 'center',
    copyable: true,
    search: false,
  },
  {
    title: '路由',
    dataIndex: 'path:fuzzy',
    align: 'center',
    hideInForm: true,
    hideInTable: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    valueType: 'select',
    valueEnum: {
      0: {
        text: '全部',
        status: 'Default',
      },
      1: {
        text: '已发布',
        status: 'Error',
      },
      2: {
        text: '未发布',
        status: 'Success',
      },
    },
  },
  {
    title: '更新时间',
    dataIndex: 'createdTime',
    align: 'center',
    search: false,
  },
  {
    title: '更新时间',
    dataIndex: 'updatedTime',
    align: 'center',
    search: false,
  },
  {
    title: '操作',
    valueType: 'option',
    align: 'center',
    key: 'option',
    render: (__, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable(record.id)
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        // onSelect={() => action?.reload()}
        menus={[
          {
            key: 'copy',
            name: '复制',

          },
          {
            key: 'delete',
            name: (
              <Popconfirm
                title="确认删除？"
                onConfirm={async () => {
                  const result = await request.delete(`${REST_API}/${record.id}`);
                  if (result.f === 1) {
                    message.success('删除成功');
                    action?.reload();
                  } else {
                    message.error(`删除失败: [${result.m}]`);
                  }
                }
                }
                okText="是的"
                cancelText="不用了"
              >
                <a href="#">删除</a>
              </Popconfirm>
            ),
          },
        ]}
      />,
    ],
  },
];

export default () => {
  const [form] = Form.useForm();
  // const history = useHistory();


  const goCreate = () => {
    history?.push('/app/lowcode/design/');
  };

  return (
    <Card>
      <ProTable
        headerTitle="页面配置"
        columns={columns}
        rowKey="id"
        request={async (params, sort, filter) => {
          const data = await request.get(REST_API, {
            params: {
              ...params,
              page: params.current,
              rows: params.pageSize,
            },
          });

          return {
            data: data.d.result,
            success: data.f === 1,
            total: data.d.pagination.count,
          };
        }}
        toolBarRender={() => [
          <Button type="primary" ghost onClick={goCreate}>
            新建页面
          </Button>,
          // <Button type="primary" onClick={onCreatePage}>
          //   新建页面
          // </Button>,
        ]}
      />
    </Card>
  );
};

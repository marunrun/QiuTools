import React from 'react';
import { Button, message } from 'antd';
import {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';


export interface FormProps {
  onSubmit: (values: Record<string, any>) => Promise<true>;
}


const CreatePage: React.FC<FormProps> = (props) => {
  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title="新建页面"
      width="50%"
      trigger={
        <Button className="font-size-12" type="primary">
          保存
        </Button>
      }
      autoFocusFirstInput
      onFinish={props.onSubmit}
    >
      <ProFormText
        width="sm"
        name="name"
        label="页面名称"
        required
        rules={[
          {
            required: true,
            message: '请输入页面名称',
          },
        ]}
      />
      <ProFormText
        width="sm"
        name="path"
        label="路由"
        required
        rules={[
          {
            required: true,
            message: '请输入路由',
          },
        ]}
      />
    </ModalForm>
  );
};
export default CreatePage;

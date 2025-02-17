import { Logo } from '@/components/Icon';
import { ILowCodePluginContext } from '@alilc/lowcode-engine';
import { Button, message } from 'antd';
import { getPageId, newSchema, PageProps, onPreview, resetSchema, saveSchema } from './utils';
import CreatePage from '../../widgets/CreatePage';
import { LOCAL_PAGE_ID } from '../../components/type';

// 注册保存面板
const HeaderPlugin = (ctx: ILowCodePluginContext) => {
  return {
    name: 'HeaderPlugin',
    async init() {
      const {
        skeleton,
        hotkey,
      } = ctx;
      // 注册 logo 面板
      skeleton.add({
        area: 'topArea',
        type: 'Widget',
        name: 'logo',
        content: <Logo logoSize="small" />,
        contentProps: {
          logo: 'https://img.alicdn.com/tfs/TB1_SocGkT2gK0jSZFkXXcIQFXa-66-66.png',
          href: '/',
        },
        props: {
          align: 'left',
          width: 100,
        },
      });
      skeleton.add({
        name: 'resetSchema',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'right',
        },
        content: (
          <Button danger type="primary" className="font-size-12" ghost onClick={resetSchema}>
            重置页面
          </Button>
        ),
      });


      if (getPageId() === LOCAL_PAGE_ID) {
        skeleton.add({
          name: 'save',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: (
            <CreatePage
              onSubmit={async (values) => {
                newSchema(values as PageProps);
                return true;
              }}
            />
          ),
        });
      } else {
        skeleton.add({
          name: 'preview',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: (
            <Button className="font-size-12" type="primary" onClick={saveSchema}>
              保存
            </Button>
          ),
        });
      }


      skeleton.add({
        name: 'preview',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'right',
        },
        content: (
          <Button className="font-size-12" type="primary" onClick={onPreview}>
            预览
          </Button>
        ),
      });
      skeleton.add({
        name: 'publish',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'right',
        },
        content: (
          <Button className="font-size-12" type="default" onClick={onPreview}>
            发布页面
          </Button>
        ),
      });
      hotkey.bind('command+s', (e) => {
        e.preventDefault();
        // saveSchema();
      });
    },
  };
};
HeaderPlugin.pluginName = 'HeaderPlugin';

export default HeaderPlugin;

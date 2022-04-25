/* eslint-disable @iceworks/best-practices/recommend-polyfill */
import { material, project } from '@alilc/lowcode-engine';
import { message, Modal } from 'antd';
import { TransformStage } from '@alilc/lowcode-types';
import { filterPackages } from '@alilc/lowcode-plugin-inject';
import { config, request } from 'ice';


const SCHEMA_API = config.SCHEMA_API ?? 'http://localhost:8112/backend/low-code/schema';

/**
 * 预览页面
 */
export const onPreview = () => {
  const pageId = getPageId();
  saveSchema();
  window.open(`${location.origin}/app/lowcode/preview/${pageId}`);
};

/**
 * 保存schema
 */
export const saveSchema = async () => {
  const pageId = getPageId();
  // 写入Schema和Package依赖
  localStorage.setItem(getLSName(pageId), JSON.stringify(project.exportSchema(TransformStage.Save)));
  const packages = await filterPackages(material.getAssets().packages);
  localStorage.setItem(getLSName(pageId, 'packages'), JSON.stringify(packages));
  message.success('成功保存到本地');
};

export const resetSchema = async () => {
  await new Promise<boolean>((resolve, reject) => {
    Modal.confirm({
      content: '确定要重置吗？您所有的修改都将消失！',
      onOk: () => {
        resolve(true);
      },
      onCancel: () => {
        reject();
      },
    });
  });


  const schema = await getPageSchema();

  project.getCurrentDocument()
    ?.importSchema(schema);
  project.simulatorHost?.rerender();
  message.success('成功重置页面');
};

/**
 * 获取PageSchema
 */
export const getPageSchema = async () => {
  const pageId = getPageId();

  // 从localstorage获取本地缓存的
  const schema = JSON.parse(localStorage.getItem(getLSName(pageId)) || '{}');
  const pageSchema = schema?.componentsTree?.[0] ?? {};
  if (Object.keys(pageSchema).length !== 0) {
    return pageSchema;
  }

  // 从接口获取
  const res = (await request.get(SCHEMA_API, {
    params: {
      // pageId默认null
      pageId: pageId === 'local' ? null : pageId,
    },
  }));

  if (res.f !== 1) {
    message.error('获取schema失败');
    return;
  }

  return JSON.parse(res.d);
};

/** 获取LocalStrong键名 */
export const getLSName = (pageId, ns = 'projectSchema') => `${ns}-${pageId}`;

/**
 * 从windos中取出pageId
 */
export const getPageId = () => {
  const { pageId } = window as any;
  return pageId ?? 'local';
};

/* eslint-disable @iceworks/best-practices/recommend-polyfill */
import { material, project } from '@alilc/lowcode-engine';
import { message, Modal } from 'antd';
import { TransformStage } from '@alilc/lowcode-types';
import { filterPackages } from '@alilc/lowcode-plugin-inject';
import { config, request, history, useParams } from 'ice';
import { LOCAL_PAGE_ID, SCHEMA_API, REST_API } from '../../components/type';
import { v4 as uuid } from 'uuid';


/**
 * 预览页面
 */
export const onPreview = () => {
  const pageId = getPageId();
  saveToLocal();
  window.open(`${location.origin}/app/lowcode/preview/${pageId}`);
};

const saveToLocal = async function () {
  const schema = project.exportSchema(TransformStage.Save);
  const packages = await filterPackages(material.getAssets().packages);

  // 本地保存到localStorage

  localStorage.setItem(getLSName(LOCAL_PAGE_ID), JSON.stringify(schema));
  localStorage.setItem(getLSName(LOCAL_PAGE_ID, 'packages'), JSON.stringify(packages));
};

/**
 * 保存schema
 */
export const saveSchema = async () => {
  const id = getPageId();
  const schema = {
    schema: getSchema(),
    packages: getPackages(),
  };

  const res = await request.put(`${REST_API}/${id}`, {
    schemaJson: JSON.stringify(schema),
  });

  if (res.f === 1) {
    message.success('保存成功');
    window.location.reload();
  } else {
    message.error('保存失败');
  }
};

export const getSchema = () => {
  return project.exportSchema(TransformStage.Save);
};
export const getPackages = async () => {
  return await filterPackages(material.getAssets().packages);
};


export interface PageProps {
  name: string;
  path: string;
}

export const newSchema = async (props: PageProps) => {
  const id = uuid().replaceAll('-', '');

  console.log(id);
  const schema = {
    schema: getSchema(),
    packages: getPackages(),
  };

  const res = await request.post(REST_API, {
    id,
    ...props,
    schemaJson: JSON.stringify(schema),
  });

  if (res.f === 1) {
    message.success('保存成功');
    history?.push(`/app/lowcode/design/${id}`);
    window.location.reload();
  } else {
    message.error('保存失败');
  }
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
  let schema = JSON.parse(localStorage.getItem(getLSName(pageId)) || '{}');


  if (Object.keys(schema).length === 0) {
    // 从接口获取
    const res = (await request.get(SCHEMA_API, {
      params: {
      // pageId默认null
        pageId: pageId === LOCAL_PAGE_ID ? null : pageId,
      },
    }));

    if (res.f !== 1) {
      message.error('获取schema失败');
      return;
    }
    schema = JSON.parse(res.d).schema;
  }
  console.log(schema);

  return schema?.componentsTree?.[0] ?? {};
};

/** 获取LocalStrong键名 */
export const getLSName = (pageId, ns = 'projectSchema') => `${ns}-${pageId}`;

/**
 * 从windos中取出pageId
 */
export const getPageId = () => {
  const { pageId } = window as any;
  return pageId ?? LOCAL_PAGE_ID;
};

---
title: '同时上传文件和文件夹'
date: '2025-10-05'
tags: ['UE']
draft: true
summary: '如何从产品层面，同时实现上传文件和文件夹'
---

## 一，特殊的需求

有个需求是，用户上传文件打开文件选择弹窗的时候，既能选择文件，也能选择文件夹。

原来的功能是只能上传多个文件，但是用户嫌太麻烦了，所以要求可以上传文件夹，但是又不能丢失之前上传多个文件的功能。

## 二，技术无法实现

让文件选择框里同时出现“文件+文件夹”混合选取，前端是无法实现的。

```html
<p>
  <span>只选择文件夹</span>
  <input name="directory" type="file" webkitdirectory multiple />
</p>
<p>
  <span>只选择文件</span>
  <input name="files" type="file" multiple />
</p>
```

从前端角度，一个文件夹选择框，要么只能选择文件，要么只能选择文件夹

## 三，产品设计层面实现

既然无法单纯让技术实现，那可以调整一下产品交互来实现：做2个入口，一个上传文件，一个上传文件夹。

效果如下：
![产品效果图](/static/images/user-experience/import-files-dirs/01.png)

代码：

```javascript

    import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
    import { Button, Upload } from 'antd';

    const { Dragger } = Upload;

    const uploadprops: any = {
        name: 'file',
        multiple: true,
        disabled: isUpload,
        showUploadList: false,
        fileList,
        beforeUpload: (file: any) => {
            return false;
        },
    };

    <Dragger {...uploadprops} directory={true} openFileDialogOnClick={false}>
        <p className="ant-upload-drag-icon">
            <InboxOutlined />
        </p>
        <div className="ant-upload-text">
            拖动文件/文件夹到此区域进行上传； 或
            <Upload {...uploadprops}>
                <Button icon={<UploadOutlined />} className="mx-2">
                    点击上传文件
                </Button>
            </Upload>
            或
            <Upload {...uploadprops} directory={true}>
                <Button icon={<UploadOutlined />} className="ml-2">
                    点击上传文件夹
                </Button>
            </Upload>
        </div>
        <p className="ant-upload-hint">支持单次或批量上传。严禁 上传公司数据或其他被禁止的文件。</p>
    </Dragger>
```

注意点： 当前讨论的是 **点击上传，打开文件选择框** 这个交互（`Upload`）。 目前 **拖拽上传** 交互（`Dragger`）是支持同时拖拽文件和文件夹的，这样没有讨论。

## 四，参考

chatgpt的回复：
![ai回复图](/static/images/user-experience/import-files-dirs/02.png)

相关问题的讨论：            

[1. 需要拖拽同时支持上传文件夹和文件上传 #29793](https://github.com/ant-design/ant-design/issues/29793)

[2. upload 组件的使用了文件夹上传，就不能支持文件上传了，两者只能选择其一，可以参考下 react-dropzone 是可以实现文件夹和文件选择上传共存的 #30292](https://github.com/ant-design/ant-design/issues/30292)

[3. 同时拖拽文件和文件夹上传文件](https://juejin.cn/post/7340539852712804387)

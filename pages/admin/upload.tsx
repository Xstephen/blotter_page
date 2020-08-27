import React, { ComponentProps } from 'react';

import Head from 'next/head';

import { Card, List, Typography, Select, Button, Tabs } from 'antd';

import { Space } from '@/components/container';
import Qiniu, { Upload, BucketSelector, ImageList } from '@/components/upload';

import { Context } from '@/utils/global';

interface AdminImagesProps extends ComponentProps<'base'> {}

interface AdminImagesState {
  bucket: string;
}

class AdminImages extends React.Component<AdminImagesProps, AdminImagesState> {
  static defaultProps = {};

  constructor(props: any) {
    super(props);
    this.state = {
      //   loading: false,
      bucket: '',
    };
  }

  render() {
    return (
      <Card>
        <Context.Consumer>
          {(context) => (
            <Head>
              <title>{`上传管理|${context.blog_name}`}</title>
            </Head>
          )}
        </Context.Consumer>
        <Qiniu />
      </Card>
    );
  }
}

export default AdminImages;

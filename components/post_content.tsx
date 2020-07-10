import React, { Component } from 'react';
import Link from 'next/link';

import { Skeleton, PageHeader, Button } from 'antd';
import { EyeOutlined, CalendarOutlined, EditOutlined, TagOutlined } from '@ant-design/icons';

import moment from 'moment';

import Image, { setImageLightbox } from '@/components/image';
import If from '@/components/if';
import TagPart from '@/components/tag';
import FocusDiv from '@/components/focus';

import { Context } from '@/utils/global';
import { travels_get_url } from '@/utils/api';

import styles from '@/pages/post/post.less';
import Carousel from './carousel';
import { Space } from './container';
import Head from 'next/head';

interface PostContentProps {
  post: {
    url: string;
    content: string;
    abstract: string;
    head_image: string;
    title: string;
    view: number;
    publish_time: string;
    edit_time: string;
    tags: Blotter.Tag[];
    images: string[];
  };
}

interface PostContentState {
  travel?: Blotter.Travel;
}

class PostContent extends Component<PostContentProps, PostContentState> {
  constructor(props) {
    super(props);
    this.state = { travel: undefined };
  }
  resetImage() {
    const containers = document.getElementsByClassName('image');
    for (var i = 0; i < containers.length; i++) {
      const imgs = containers[i].getElementsByTagName('img');
      for (var j = 0; j < imgs.length; j++) {
        setImageLightbox(imgs[j]);
      }
    }
  }
  componentDidMount() {
    this.resetImage();
    if (this.isTravel()) {
      this.getTravelData();
    }
  }
  componentDidUpdate() {
    this.resetImage();
  }

  isTravel = () => {
    return (
      this.props.post.tags.filter((item) => item.name === '游记' && item.short === 'travels')
        .length > 0
    );
  };

  getTravelData = () => {
    travels_get_url(this.props.post.url)
      .then((r) => {
        if (r.exist) {
          this.setState({ travel: r.travel });
        }
      })
      .catch(console.error);
  };

  renderTravel = () => {
    const travel = this.state.travel;
    if (!!travel) {
      const lnglat = `${travel.lng},${travel.lat}`;
      return (
        <details>
          <summary>游记详细信息</summary>
          <Image
            clickable
            height={'512px'}
            maxHeight="50vh"
            src={`https://restapi.amap.com/v3/staticmap?location=${lnglat}&zoom${travel.zoom}&scale=2&size=1024*1024&markers=mid,,A:${lnglat}&key=5918961af3c0ffafa1a3cb1056556c98`}
            alt={`${travel.name}地图`}
            title={`${moment(travel.time, 'X').format('YYYY-MM-DD')} 于 ${travel.name}`}
          />
          <p style={{ textAlign: 'center', fontSize: '1.25em' }}>
            该文章是一篇 <strong>{moment(travel.time, 'X').format('YYYY-MM-DD')}</strong> 于{' '}
            <strong>{travel.name}</strong> 的游记， 更多游记见
            <a href="/apps/travels" target="_blank">
              游记列表
            </a>
          </p>
        </details>
      );
    } else {
      return null;
    }
  };

  render() {
    return this.props.post === undefined ? (
      <Skeleton active={true} />
    ) : (
      <article className={styles.post}>
        <Head>
          {this.props.post.content.indexOf('katex') != -1 ? (
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min.css"
              integrity="sha384-zB1R0rpPzHqg7Kpt0Aljp8JPLqbXI3bhnPWROx27a9N0Ll6ZP/+DiW/UqRcLbRjq"
              crossOrigin="anonymous"
            ></link>
          ) : null}
        </Head>
        <Space size={20}>
          <PageHeader className="shadow" title={this.props.post.title}>
            <Space>
              <Space direction="horizontal">
                <div>
                  <EyeOutlined className="right5" />
                  {this.props.post.view}
                </div>
                <div>
                  <CalendarOutlined className="right5" />
                  {this.props.post.publish_time}
                </div>
                {this.props.post.publish_time == this.props.post.edit_time ? null : (
                  <div>
                    <EditOutlined className="right5" />
                    {this.props.post.edit_time}
                  </div>
                )}
                <Context.Consumer>
                  {(context) =>
                    (context.user.permission & 1) == 1 ? (
                      <Link href={`/admin/post?url=${this.props.post.url}`}>
                        <Button type="primary" size="small">
                          编辑
                        </Button>
                      </Link>
                    ) : null
                  }
                </Context.Consumer>
              </Space>
              <If condition={!!this.props.post.abstract}>
                <blockquote>{this.props.post.abstract}</blockquote>
              </If>
              <div>
                <TagOutlined className="right20" />
                {this.props.post.tags.length > 0 ? (
                  this.props.post.tags.map((tag: Blotter.Tag) => (
                    <TagPart key={tag.short} tag={tag} />
                  ))
                ) : (
                  <span>无标签</span>
                )}
              </div>
            </Space>
          </PageHeader>

          {this.renderTravel()}

          {!!this.props.post.images && this.props.post.images.length > 0 ? (
            <Carousel
              images={this.props.post.images}
              height={'500px'}
              maxHeight={'50vh'}
              autoplay
            />
          ) : null}

          {/* <If condition={this.props.post.head_image !== ''}>
          <a
            className="headimage image"
            target="_blank"
            rel="noopener noreferrer"
            href={this.props.post.head_image}
          >
            <img src={this.props.post.head_image} alt={this.props.post.title} />
          </a>
        </If> */}
          <section
            className="post-content"
            dangerouslySetInnerHTML={{ __html: this.props.post.content }}
          />
        </Space>
      </article>
    );
  }
}

export default PostContent;
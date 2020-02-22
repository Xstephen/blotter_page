import React, { ComponentProps, Fragment } from 'react';

import Link from 'next/link';
import Head from 'next/head';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';

import { Affix, Button, Layout, BackTop, Row, Divider, Form, Menu, Icon, Modal, Input } from 'antd';
const { Footer, Sider, Content } = Layout;
import { FormComponentProps } from 'antd/lib/form';

import Container from '@/components/container';

import { layout, login, logout } from '@/utils/api';
import ShowNotification from '@/utils/notification';
import { GlobalProps, Context } from '@/utils/global';
import { setCookie } from '@/utils/cookies';

import styles from './layout.less';

interface BasicLayoutProps extends ComponentProps<'base'>, FormComponentProps, WithRouterProps {
  //   menus: Blotter.Menu[];
  //   beian: string;
  //   view: number;
  //   blog_name: string;
}
interface BasicLayoutState {
  collapsed: boolean;
  broken: boolean;
  loginModel: boolean;
  password: string;
  okDisabled: boolean;

  //   blog_name: string;
  //   token: string;
}

class BasicLayout extends React.Component<BasicLayoutProps, BasicLayoutState> {
  static contextType = Context;

  static async getInitialProps(args: any) {
    var r = await layout();
    return r;
  }

  constructor(props: BasicLayoutProps) {
    super(props);
    this.state = {
      collapsed: true,
      broken: false,
      loginModel: false,
      password: '',
      okDisabled: false,
    };
  }

  onCollapse = (collapsed: boolean, type: string) => {
    if (type == 'responsive') {
      this.setState({ collapsed: true });
    } else {
      this.setState({ collapsed });
    }
  };

  onBreakpoint = (broken: boolean) => {
    this.setState(() => ({ broken: broken }));
    this.setState(() => ({ collapsed: true }));
  };

  onCollapseButtonClick = () => this.setState(state => ({ collapsed: !state.collapsed }));

  renderCollapseButton = () => (
    <Affix
      offsetTop={this.state.broken ? window.innerHeight - 60 : 20}
      style={Object.assign(
        { position: 'fixed', marginLeft: 20, zIndex: 100 },
        this.state.broken ? { bottom: 20 } : { top: 20 },
      )}
    >
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={this.state.collapsed ? 'bars' : 'left'}
        className="shadow"
        onClick={this.onCollapseButtonClick}
      />
    </Affix>
  );

  onLoginClick = () => {
    this.setState({ loginModel: true });
  };

  onLogoutClick = async () => {
    var r = await logout();
    if (ShowNotification(r)) {
      setCookie('token', '', 0);
    }
    this.context.callback({ token: '' });
  };

  loginOK = async () => {
    this.setState({ okDisabled: true });
    var { username, password } = this.props.form.getFieldsValue(['username', 'password']);
    var r = await login(username, password);
    if (ShowNotification(r)) {
      this.context.callback({ token: r.token });
      this.setState({ loginModel: false, okDisabled: false });
    } else {
      this.setState({ okDisabled: false });
    }
  };
  loginCancel = () => {
    this.setState({ loginModel: false });
  };

  renderMenus = (menus: Blotter.Menu[], token: string) => {
    return (
      <Menu
        theme="light"
        selectedKeys={[this.props.router.pathname]}
        mode="inline"
        inlineIndent={10}
      >
        {menus.map((item: Blotter.Menu) => {
          return (
            <Menu.Item key={item.link}>
              <Link href={item.link}>
                <a>
                  {item.link ? <Icon type={item.icon} /> : null}
                  <span> {item.name}</span>
                </a>
              </Link>
            </Menu.Item>
          );
        })}
        {token == '' ? (
          <Menu.Item key="login" onClick={this.onLoginClick}>
            <Icon type="login" />
            <span>登录</span>
          </Menu.Item>
        ) : (
          [
            <Menu.Item key="setting">
              <Link href="/admin">
                <a>
                  <Icon type="setting" />
                  <span>后台</span>
                </a>
              </Link>
            </Menu.Item>,
            <Menu.Item key="logout" onClick={this.onLogoutClick}>
              <Icon type="logout" />
              <span>登出</span>
            </Menu.Item>,
          ]
        )}
        <Modal
          title="登录"
          visible={this.state.loginModel}
          onOk={this.loginOK}
          onCancel={this.loginCancel}
          okButtonProps={{ disabled: this.state.okDisabled }}
        >
          <Form>
            <Form.Item>
              {this.props.form.getFieldDecorator('username')(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {this.props.form.getFieldDecorator(`password`)(
                <Input.Password
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="密码"
                  onPressEnter={this.loginOK}
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </Menu>
    );
  };

  renderSider = () => {
    return (
      <Sider
        theme="light"
        trigger={null}
        breakpoint="xl"
        collapsible={true}
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
        collapsedWidth={this.state.broken ? 0 : 80}
        onBreakpoint={this.onBreakpoint}
      >
        <div className={styles.sider}>
          <Row type="flex" justify="center" className={styles.avatar}>
            <img
              src="/static/img/logo.svg"
              width={'100%'}
              height={'100%'}
              style={{ background: 'white', borderRadius: '100px', maxWidth: '120px' }}
            />
          </Row>

          <Divider className={this.state.collapsed ? styles.divider : undefined}>
            <b className={styles.divider}>OhYee</b>
          </Divider>
          <Context.Consumer>
            {context => this.renderMenus(context.menus, context.token)}
          </Context.Consumer>
        </div>
      </Sider>
    );
  };

  renderRSSIcon = () => (
    <svg
      className="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="1115"
      data-spm-anchor-id="a313x.7781069.0.i1"
    >
      <path
        d="M42.666667 853.333333a128 128 0 1 1 256 0 128 128 0 0 1-256 0z m938.666666 128h-178.773333c0-418.986667-340.906667-759.893333-759.893333-759.893333V42.666667c517.546667 0 938.666667 421.12 938.666666 938.666666z m-298.666666 0h-182.826667c0-252.074667-205.098667-457.130667-457.173333-457.130666V341.333333c352.896 0 640 287.104 640 640z"
        fill="#EE802F"
        p-id="1116"
      ></path>
    </svg>
  );

  renderFooter = () => {
    return (
      <Container>
        <Context.Consumer>
          {context => {
            return (
              <div className={styles.footer}>
                <p>
                  <a href="/rss.xml">
                    <Icon style={{ width: '1em' }} component={this.renderRSSIcon} />
                    RSS订阅
                  </a>
                </p>
                <p>
                  <Icon type="eye" style={{ fontSize: '0.75em' }} /> 全站访问量 {context.view}
                </p>
                <p>
                  <span className="right5">2017 – {new Date().getFullYear()}</span>
                  <a href="http://beian.miit.gov.cn/">{context.beian}</a>
                </p>
                <p>
                  Powered by <a href="https://github.com/OhYee/blotter">Blotter</a>
                  (Go + React)
                </p>
                <p>
                  <span className="right5">
                    <a href="/sitemap.txt">站点地图(TXT)</a>
                  </span>
                  <span>
                    <a href="/sitemap.xml">站点地图(XML)</a>
                  </span>
                </p>
              </div>
            );
          }}
        </Context.Consumer>
      </Container>
    );
  };

  render() {
    return (
      <Layout
        style={{ minHeight: '100%' }}
        className={this.state.collapsed ? undefined : styles.dimmed}
      >
        <Context.Consumer>
          {context => (
            <Head>
              <title>{context.blog_name}</title>
            </Head>
          )}
        </Context.Consumer>

        <Layout
          className={'shadow'}
          style={{ position: 'fixed', zIndex: 100, height: '100vh', overflow: 'auto' }}
        >
          {this.renderSider()}
          <Content>{this.renderCollapseButton()}</Content>
        </Layout>
        <Layout style={this.state.collapsed ? {} : {}}>
          <Content>
            <div className={styles.main_content}>{this.props.children}</div>
            <BackTop />
          </Content>
          <Footer>{this.renderFooter()}</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Form.create<BasicLayoutProps>({ name: 'BasicLayout' })(withRouter(BasicLayout));
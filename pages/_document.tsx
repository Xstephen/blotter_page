import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { guessPath } from '@/utils/redirect';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    if (!!ctx.req) {
      const path = guessPath(ctx.req.url);
      if (path !== '') {
        console.log(`301 ${ctx.req.url} ==> ${path}`);
        ctx.res.writeHead(301, {
          Location: path,
        });
        ctx.res.end();
      }
    }

    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="theme-color" content="#1565c0" />
          <meta name="msapplication-TileColor" content="#1565c0" />
          <meta name="msapplication-TileImage" content="/static/img/logo_196x196.png" />
          <link rel="shortcut icon" href="/static/img/favicon.ico"></link>
          <script
            dangerouslySetInnerHTML={{
              __html: `
window.onload = function() { 
    // 百度自动推送
    (function(){
        var bp = document.createElement('script');
        var curProtocol = window.location.protocol.split(':')[0];
        if (curProtocol === 'https') {
            bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
        }
        else {
            bp.src = 'http://push.zhanzhang.baidu.com/push.js';
        }
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(bp, s);
    })();

    // 百度统计
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?9f114bc8c6227268e6d0e44abd656932";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
    })();

}            
`,
            }}
          ></script>
        </Head>
        <body>
          <Main />
          <div id="portals"></div>
          <NextScript />
        </body>
      </Html>
    );
  }
}

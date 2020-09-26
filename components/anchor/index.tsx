import React from 'react';

import { Flex } from '@/components/container';
import { Left } from '@/components/svg';
import Button from '@/components/button';

import { concat, ComponentProps } from '@/utils/component';
import { Context } from '@/utils/global';

import styles from './anchor.less';
import shadowStyles from '@/styles/shadow.less';

export declare type AnchorType = {
  name: string;
  id: string;
  level: number;
};

export declare type AnchorProps = ComponentProps<{
  content: string;
  indent?: number;
  width?: number;
  suffixAnchors?: AnchorType[];
  container?: HTMLElement;
}>;

export default function Anchor(props: AnchorProps) {
  const {
    content,
    className,
    indent = 10,
    width = 275,
    suffixAnchors: suffixAnchor = [],
    container,
    ...restProps
  } = props;
  const ref = React.useRef<HTMLDivElement>();
  const context = React.useContext(Context);
  const anchors = React.useMemo(() => findAnchors(content).concat(suffixAnchor), [
    content,
    suffixAnchor,
  ]);
  const [show, setShow] = React.useState(context.big_screen);
  const syncScroll = React.useCallback(
    (e: Event) => {
      const target = e.target === document ? document.documentElement : (e.target as HTMLElement);
      if (!!ref.current) ref.current.style.top = `${target.scrollTop + 100}px`;
    },
    [ref],
  );
  React.useEffect(() => {
    const c = !!container ? container : document;
    if (!!c) {
      c.addEventListener('scroll', syncScroll);
      return () => c.removeEventListener('scroll', syncScroll);
    }
  }, [container, syncScroll]);

  return (
    <div
      ref={ref}
      {...restProps}
      className={concat(styles.anchor, show ? styles.show : '', className)}
    >
      <Button
        neumorphism
        className={concat(styles.button)}
        icon={<Left className={styles.icon} />}
        onClick={() => setShow(!show)}
      />

      <Flex
        direction="TB"
        subAxis="flex-start"
        wrap={false}
        className={concat(styles.links, shadowStyles.neumorphism)}
      >
        {anchors.map((item) => (
          <a
            key={item.id}
            id={`anchor-${item.id}`}
            href={`#${item.id}`}
            style={{ paddingLeft: (item.level - 1) * indent }}
            title={item.name}
          >
            {item.name}
          </a>
        ))}
      </Flex>
    </div>
  );
}

export function findAnchors(html: string): AnchorType[] {
  var re = new RegExp(`<h([1-6]) id="(.*)">(.*)</h\\1>`, 'g');
  var result_list: AnchorType[] = [];

  do {
    var result = re.exec(html);
    if (result !== null) {
      result_list.push({
        id: `${result[2]}`,
        name: result[3],
        level: parseInt(result[1]),
      });
    }
  } while (result);

  return result_list;
}

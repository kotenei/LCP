import { HTMLAttributes, memo, useEffect } from 'react';
import { Row, Col, Card, Spin } from 'antd';

import { useAppDispatch, useAppSelector } from '../../store';
import { Layout } from '../../components/layout';
import { getTemplates } from '../../common/modules/template';
import './home.scss';

export interface HomeProps extends LCPWeb.BasicProps<HTMLAttributes<HTMLDivElement>> {}

const { Meta } = Card;

const Home = (props: HomeProps) => {
  const { prefixCls = 'lcp-web-home' } = props;
  const { templates, templatesLoading } = useAppSelector((state) => state.template);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTemplates({}));
  }, [dispatch]);

  const renderTemplates = () => {
    return (
      templates &&
      templates.map((template) => (
        <Col span={6} key={template.id}>
          <Card hoverable cover={<img alt='example' src={template.coverImg} />}>
            <Meta title={template.title} description={`已复制 ${template.copiedCount} 次`} />
          </Card>
        </Col>
      ))
    );
  };

  return (
    <Layout className={prefixCls}>
      <div className={`${prefixCls}-container`}>
        <div className={`${prefixCls}-header`}>
          <h1>热门海报</h1>
          <p>只需替换文字和图片，一键自动生成H5</p>
        </div>
        {templatesLoading && <Spin className={`${prefixCls}-loading`} size='large' />}
        <Row gutter={[32, 32]}>{renderTemplates()}</Row>
      </div>
    </Layout>
  );
};

export default memo(Home);

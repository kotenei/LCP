import axios from 'axios';
import { ResponseData } from './axios-interceptor';

export const getTemplate = (id: number) => {
  const data: any = {
    id: '1',
    title: '模板',
    author: '测试',
    components: [
      {
        id: '1',
        type: 'h1',
        props: {
          style: {
            fontSize: 14,
          },
          children: '123',
        },
      },
    ],
  };

  return Promise.resolve({ data });
  // return axios.get(`/api/template/${id}`)
};

export const getTemplates = (params: any): Promise<ResponseData<any>> => {
  const data: any = [
    { id: '1', title: '樊登解读意志力', coverImg: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', copiedCount: 10 },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, 500);
  });
  // return axios.get(`/api/template/`, { params })
};

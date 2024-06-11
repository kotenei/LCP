import axios from "axios";

export const getTemplate = (id: number) => {
  const data: any = {
    id: "1",
    title: "模板",
    author: "测试",
    components: [
      {
        id: "1",
        type: "h1",
        props: {
          style: {
            fontSize: 14,
          },
          children: "123",
        },
      },
    ],
  };

  return Promise.resolve({ data });
  // return axios.get(`/api/template/${id}`)
};

export const getTemplates = (params: any) =>
  axios.get(`/api/template/`, { params });

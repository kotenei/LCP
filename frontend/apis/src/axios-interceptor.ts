import axios from "axios";

interface IInterceptorOps {
  request: any;
  response: any;
}

const aixosInterceptors = (options: IInterceptorOps) => {};

export default aixosInterceptors;

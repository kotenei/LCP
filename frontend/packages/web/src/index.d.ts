export type Diff<T extends string, U extends string> = ({ [P in T]: P } & {
  [P in U]: never;
} & {
  [x: string]: never;
})[T];

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type BasicProps<T, K extends keyof T = never> = Omit<T, K> & {
  className?: string;
  prefixCls?: string;
  style?: React.CSSProperties;
  children?: any;
};

export as namespace LCPWeb;

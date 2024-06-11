export interface DynamicTagProps {
  type: string;
  props?: any;
}
const DynamicTag = (props: DynamicTagProps) => {
  const { type = "div", props: properties } = props;
  const Component = type as any;
  return <Component {...properties} />;
};

export default DynamicTag;

export interface DynamicTagProps {
  type: string;
  props?: any;
}
const DynamicTag = (props: DynamicTagProps) => {
  const { type = 'div', props: properties, ...others } = props;
  const Component = type as any;
  return <Component {...properties} {...others} />;
};

export default DynamicTag;

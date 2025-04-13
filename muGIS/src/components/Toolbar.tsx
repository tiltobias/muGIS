import { FC } from 'react';
import "./Toolbar.css";
import IntersectTool from './tools/IntersectTool';
import UnionTool from './tools/UnionTool';

const Toolbar: FC = () => {
  return (
    <>
    <IntersectTool />
    <UnionTool />
    </>
  )
}

export default Toolbar;
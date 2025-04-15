import { FC } from 'react';
import './Toolbar.css';
import { IntersectTool, UnionTool } from './tool/tools';

const Toolbar: FC = () => {
  return (
    <>
      <IntersectTool />
      <UnionTool />
    </>
  )
}

export default Toolbar;
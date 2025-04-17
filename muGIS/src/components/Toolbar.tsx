import { FC } from 'react';
import './Toolbar.css';
import { BufferTool, IntersectTool, UnionTool, DifferenceTool, DissolveTool } from './tool/tools';

const Toolbar: FC = () => {
  return (
    <>
      <BufferTool />
      <IntersectTool />
      <UnionTool />
      <DifferenceTool />
      <DissolveTool />
    </>
  )
}

export default Toolbar;
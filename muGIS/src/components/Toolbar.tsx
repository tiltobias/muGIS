import { FC } from 'react';
import './Toolbar.css';
import { BufferTool, IntersectTool, UnionTool, DifferenceTool, DissolveTool, VoronoiTool } from './tool/tools';

const Toolbar: FC = () => {
  return (
    <>
      <BufferTool />
      <IntersectTool />
      <UnionTool />
      <DifferenceTool />
      <DissolveTool />
      <VoronoiTool />
    </>
  )
}

export default Toolbar;
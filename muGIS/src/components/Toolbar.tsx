import { FC } from 'react';
import './Toolbar.css';
import { BufferTool, IntersectTool, UnionTool, DifferenceTool, DissolveTool, VoronoiTool, BboxTool } from './tool/tools';

const Toolbar: FC = () => {
  return (
    <>
      <BufferTool />
      <IntersectTool />
      <UnionTool />
      <DifferenceTool />
      <DissolveTool />
      <VoronoiTool />
      <BboxTool />
    </>
  )
}

export default Toolbar;
import { FC } from 'react';
import './Toolbar.css';
import { BufferTool, IntersectTool, UnionTool, DifferenceTool, DissolveTool, VoronoiTool, BboxTool, ClipTool } from './tool/tools';

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
      <ClipTool />
    </>
  )
}

export default Toolbar;
// src/components/TabPanel.tsx
import React from 'react';

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  // 선택된 탭 인덱스와 패널의 인덱스가 일치할 때만 내용을 렌더링
  return value === index ? <div>{children}</div> : null;
};

export default TabPanel;
// src/components/TabPanel.tsx
import React from 'react';

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {

  return value === index ? <div>{children}</div> : null;
};

export default TabPanel;
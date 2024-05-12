import React, { useState } from 'react';
import TabEmojiFeedUpload from './TabEmojiFeedUpload';
import TabEmojiFeedList from './TabEmojiFeedList';




const FeedDemo = () => {
  const [tabIndex, setTabIndex] = useState(0);



  return (
    <div>
      <div className="flex p-4 space-x-4">
        <button onClick={() => setTabIndex(0)} className="tab-button">그룹 이모지 업로드</button>
        <button onClick={() => setTabIndex(1)} className="tab-button">그룹 이모지 리스트</button>
      </div>
      {tabIndex === 0 && <TabEmojiFeedList />}
      {tabIndex === 1 && <TabEmojiFeedUpload/>}
    </div>
  );
};

export default FeedDemo;

import React from 'react';
import { useState } from 'react';
import classes from './Tab.module.css';

export const Tab = ({ tabs, defaultTab = 0 }) => {
    const [currentTab, setCurrentTab] = useState(defaultTab);

    return (
        <div>
            <div className={classes.tabTitles}>
                {tabs.map((tab, index) => <div className={`${classes.tabTitle} ${currentTab === index ? classes.tabActive : ''}`} key={tab.title} onClick={() => setCurrentTab(index)}>{tab.title}</div>)}
            </div>
            {tabs[currentTab].component}
        </div>
    )
}

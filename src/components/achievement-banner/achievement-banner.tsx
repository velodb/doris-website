import React from 'react';
import { AchievementBannerItemsData } from './achievement-banner.data';
import './achievement-banner.scss';

export function AchievementBanner() {
    return (
        <section className="container achievement-banner-wrapper ">
            {AchievementBannerItemsData.map(({ title, content }) => (
                <div className="achievement-banner-item" key={title}>
                    <div className="highlight">{title}</div>
                    <div>{content}</div>
                </div>
            ))}
        </section>
    );
}

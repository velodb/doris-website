import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';
import './style.scss';
export default function BlogLayout(props) {
    const { sidebar, toc, children, pageType, ...layoutProps } = props;
    const hasSidebar = sidebar && sidebar.items.length > 0;
    const isBlogListPage = pageType === 'blogList';

    return (
        <Layout {...layoutProps}>
            <div className="container mb-[4.875rem] blog-container">
                <div className="row">
                    <BlogSidebar sidebar={sidebar} />
                    <main
                        className={clsx({
                            col: !isBlogListPage,
                            'col--7': hasSidebar && !isBlogListPage,
                            'col--12': !hasSidebar && isBlogListPage,
                            'col--9 col--offset-1': !hasSidebar && !isBlogListPage,
                        })}
                        itemScope
                        itemType="http://schema.org/Blog"
                    >
                        {children}
                    </main>
                    {toc && <div className="col col--2">{toc}</div>}
                </div>
            </div>
        </Layout>
    );
}

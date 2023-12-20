import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { PageMetadata, HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common';
import BlogLayout from '../BlogLayout';
import BlogListItem from '../BlogListItem';
import './styles.scss';
import useIsBrowser from '@docusaurus/useIsBrowser';
import HeadBlogs from '@site/src/components/blogs/components/head-blogs';
import PageHeader from '@site/src/components/PageHeader';
import BlogListFooter from '../BlogFooter';
const allText = 'All';

function BlogListPageMetadata(props) {
    const { metadata } = props;
    const {
        siteConfig: { title: siteTitle },
    } = useDocusaurusContext();
    const { blogDescription, blogTitle, permalink } = metadata;
    const isBlogOnlyMode = permalink === '/';
    const title = isBlogOnlyMode ? siteTitle : blogTitle;
    return (
        <>
            <PageMetadata title={title} description={blogDescription} />
        </>
    );
}

function getBlogCategories(props) {
    const { siteConfig } = useDocusaurusContext();
    const allText = 'All';
    const { items } = props;
    const allCategory = { label: allText, values: [] };
    const categories = [allCategory];

    useEffect(() => {
        sessionStorage.setItem('tag', allText);
    }, []);
    items.forEach(({ content: BlogPostContent }) => {
        const { frontMatter } = BlogPostContent;
        const tags = frontMatter.tags || [];
        if (tags.length > 0) {
            tags.forEach(tag => {
                const index = categories.length > 0 ? categories.findIndex(cate => cate.label === tag) : -1;
                if (index > -1) {
                    const curCategory = categories[index];
                    curCategory.values.push(BlogPostContent);
                } else {
                    const category = {
                        label: tag,
                        values: [BlogPostContent],
                    };
                    categories.push(category);
                }
                if (allCategory.values.every(val => val.metadata.permalink !== BlogPostContent.metadata.permalink)) {
                    allCategory.values.push(BlogPostContent);
                }
            });
        }
    });
    return categories;
}

function BlogListPageContent(props) {
    const { metadata, items, sidebar } = props;
    const isBrowser = useIsBrowser();
    const [blogs, setBlogs] = useState([]);
    const blogCategories = getBlogCategories(props);
    const ALL_BLOG = blogCategories.find(item => item.label === allText).values;

    const { siteConfig } = useDocusaurusContext();
    const isCN = siteConfig.baseUrl.indexOf('zh-CN') > -1;
    const [active, setActive] = useState(() => {
        const tag = isBrowser ? sessionStorage.getItem('tag') : allText;
        return tag || allText;
    });
    const [pageSize, setPageSize] = useState<number>(8);
    let [pageNumber, setPageNumber] = useState<number>(1);
    const [currentBlogs, setCurrentBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState<number>(0);

    const changeCategory = category => {
        setPageNumber(1);
        setActive(category);
        let currentCategory = blogCategories.find(item => item.label === category);
        if (!currentCategory) {
            setActive(allText);
            currentCategory = blogCategories.find(item => item.label === allText);
        }
        setBlogs(currentCategory.values);
    };

    useEffect(() => {
        changeCategory(active);
        isBrowser && sessionStorage.setItem('tag', active);
    }, [active]);

    return (
        <BlogLayout sidebar={sidebar} pageType="blogList">
            <PageHeader title="Blog" className="bg-white" {...props} />
            <HeadBlogs blogs={ALL_BLOG} />
            <div className="blog-list-wrap row">
                <ul className="scrollbar-none mt-0 m-auto flex gap-3 overflow-auto text-[#4C576C] lg:mt-[5.5rem]  lg:justify-center lg:gap-6 ">
                    {blogCategories.map((item: any) => (
                        <li className=" py-px" key={item.id} onClick={() => changeCategory(item.label)}>
                            <span
                                className={`block cursor-pointer whitespace-nowrap rounded-[2.5rem] px-4 py-2 text-sm  shadow-[0px_1px_4px_0px_rgba(49,77,136,0.10)] hover:bg-[#444FD9] hover:text-white lg:px-6 lg:py-3 lg:text-base ${
                                    active === item.label && 'bg-[#444FD9] text-white'
                                }`}
                            >
                                {item.label}
                            </span>
                        </li>
                    ))}
                </ul>
                <ul className="mt-6 grid gap-6 lg:mt-10 lg:grid-cols-3">
                    {blogs.map((BlogPostContent, i) => (
                        <BlogListItem
                            key={BlogPostContent.metadata.permalink + i}
                            frontMatter={BlogPostContent.frontMatter}
                            assets={BlogPostContent.assets}
                            metadata={BlogPostContent.metadata}
                            truncated={BlogPostContent.metadata.truncated}
                        >
                            <BlogPostContent />
                        </BlogListItem>
                    ))}
                </ul>
                <BlogListFooter total={blogs.length} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </div>
        </BlogLayout>
    );
}

export default function BlogListPage(props) {
    return (
        <HtmlClassNameProvider className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogListPage)}>
            <BlogListPageMetadata {...props} />
            <BlogListPageContent {...props} />
        </HtmlClassNameProvider>
    );
}

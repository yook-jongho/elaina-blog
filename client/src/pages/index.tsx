import React from 'react';
import { useRouter } from 'next/router';
import { NextPageContext, InferGetServerSidePropsType } from 'next';

import { initApolloClient } from 'src/apollo/withApollo';
import { GET_LASTEST_POSTS } from 'src/query/post';
import { GET_CATEGORIES_WITH_DETAILS, CategoryDetails } from 'src/query/category';
import { GET_PROFILE, ProfileType } from 'src/query/profile';
import { GET_ABOUT } from 'src/query/about';

import { AppCommonProps } from './_app';
import { MainPageLayout } from './main/component/MainPageLayout';
import { AboutPage } from './main/about/About';
import { ContentCategory } from './main/component/ContentCategory';

interface Props extends AppCommonProps {
  latestPosts: InferGetServerSidePropsType<typeof getServerSideProps>;
  profile: InferGetServerSidePropsType<typeof getServerSideProps>;
  categories: InferGetServerSidePropsType<typeof getServerSideProps>;
  about: InferGetServerSidePropsType<typeof getServerSideProps>;
}

export default function Index(props: Props) {
  const router = useRouter();

  if (router.query['tab'] === 'about') {
    return (
      <MainPageLayout profile={props.profile} isLogin={props.app.isLogin}>
        <AboutPage profile={props.profile} about={props.about} />
      </MainPageLayout>
    );
  }

  return (
    <MainPageLayout profile={props.profile} isLogin={props.app.isLogin}>
      <ContentCategory categories={props.categories} latestPosts={props.latestPosts} isLogin={props.app.isLogin} />
    </MainPageLayout>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const apolloClient = initApolloClient({}, context);
  const profileQueryResult = await apolloClient.query({ query: GET_PROFILE });
  const categoryQueryResult = await apolloClient.query({ query: GET_CATEGORIES_WITH_DETAILS });
  const categoryLatestPostQueryResult = await apolloClient.query({ query: GET_LASTEST_POSTS });
  const aboutQueryResult = await apolloClient.query({ query: GET_ABOUT });

  const about = aboutQueryResult.data.about;
  const profile: ProfileType = profileQueryResult.data.profile;
  const categories: CategoryDetails[] = categoryQueryResult.data.categoriesWithDetails;
  const latestPosts = categoryLatestPostQueryResult.data.getLatestPostsEachCategory;

  return {
    props: {
      latestPosts,
      profile,
      categories,
      about
    }
  };
}

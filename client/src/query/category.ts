import { gql } from '@apollo/client';

export interface Category {
  _id: number;
  title: string;
  description: string;
  previewImage: string;
  order: number;
}

export interface CategoryDetails {
  _id: number;
  title: string;
  description: string;
  previewImage: string;
  recentCreatedAt: Date;
  postCount: number;
}

export const GET_CATEGORY = gql`
  query categories {
    categories {
      _id
      title
      description
      previewImage
      order
    }
  }
`;

export const GET_CATEGORIES_WITH_DETAILS = gql`
  query {
    categoriesWithDetails {
      _id
      title
      description
      previewImage
      postCount
      recentCreatedAt
    }
  }
`;

export const FIND_CATEGORY_BY_ID = gql`
  query($id: Int!) {
    findCategoryById(id: $id) {
      title
      description
      previewImage
    }
  }
`;

export const ADD_CATEGORY = gql`
  mutation($title: String!, $description: String!, $previewImage: String!) {
    addCategory(title: $title, description: $description, previewImage: $previewImage) {
      isSuccess
      errorMsg
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation($index: Int!) {
    deleteCategory(index: $index) {
      isSuccess
      errorMsg
    }
  }
`;

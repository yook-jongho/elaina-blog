import { gql } from '@apollo/client';

interface Category {
  title: string;
  description: string;
  previewImage: string;
}

export const GET_CATEGORY = gql`
  query categories {
    categories {
      title
      description
      previewImage
    }
  }
`;

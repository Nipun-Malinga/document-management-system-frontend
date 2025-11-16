import type { Link } from '@/models/Link';
import {
  Breadcrumb as BC,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '../ui/breadcrumb';
import { Fragment } from 'react/jsx-runtime';
import { useNavigate } from 'react-router-dom';

interface Props {
  links: Link[];
}

const Breadcrumb = ({ links }: Props) => {
  const navigate = useNavigate();

  return (
    <BC className='mb-6'>
      <BreadcrumbList className='flex items-center gap-2'>
        {links.map((link, key) => (
          <Fragment key={key}>
            <BreadcrumbItem>
              {key === links.length - 1 ? (
                <BreadcrumbPage className='font-semibold text-gray-900 dark:text-gray-100'>
                  {link.title}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink 
                  onClick={() => navigate(link.endpoint)} 
                  className='cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-150 font-medium'
                >
                  {link.title}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {key !== links.length - 1 && (
              <BreadcrumbSeparator className='text-gray-400 dark:text-gray-600' />
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </BC>
  );
};

export default Breadcrumb;
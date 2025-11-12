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
      <BreadcrumbList>
        {links.map((link, key) => (
          <Fragment key={key}>
            <BreadcrumbItem>
              {key == links.length - 1 ? (
                <BreadcrumbPage>{link.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink onClick={() => navigate(link.endpoint)} className='cursor-pointer'>
                  {link.title}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {key != links.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </BC>
  );
};

export default Breadcrumb;

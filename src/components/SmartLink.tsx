import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

interface SmartLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

// Link que aceita rota interna ("/doacao"), âncora ("/#newsletter") ou endereço externo ("https://...")
const SmartLink = forwardRef<HTMLAnchorElement, SmartLinkProps>(({ to, children, ...props }, ref) => {
  const isInternal = to.startsWith('/') && !to.startsWith('//') && !to.startsWith('/files/');
  if (isInternal) {
    return (
      <Link ref={ref} to={to} {...props}>
        {children}
      </Link>
    );
  }
  const isExternal = /^https?:\/\//.test(to) || to.startsWith('/files/');
  return (
    <a ref={ref} href={to} {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props}>
      {children}
    </a>
  );
});
SmartLink.displayName = 'SmartLink';

export default SmartLink;

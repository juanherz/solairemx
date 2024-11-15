import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function Index() {
  const { pathname, push } = useRouter();

  useEffect(() => {
    if (pathname === PATH_DASHBOARD.user.root) {
      try {push(PATH_DASHBOARD.user.profile);}
      catch {
        push(PATH_DASHBOARD.calendar);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}

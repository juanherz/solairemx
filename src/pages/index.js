// // @mui
// import { styled } from '@mui/material/styles';
// // layouts
// import Layout from '../layouts';
// // components
// import Page from '../components/Page';
// // sections
// import {
//   HomeHero,
//   HomeMinimal,
//   HomeDarkMode,
//   HomeLookingFor,
//   HomeColorPresets,
//   HomePricingPlans,
//   HomeAdvertisement,
//   HomeCleanInterfaces,
//   HomeHugePackElements,
// } from '../sections/home';
// import RoleBasedGuard from '../guards/RoleBasedGuard';

// // ----------------------------------------------------------------------

// const RootStyle = styled('div')(() => ({
//   height: '100%',
// }));

// const ContentStyle = styled('div')(({ theme }) => ({
//   overflow: 'hidden',
//   position: 'relative',
//   backgroundColor: theme.palette.background.default,
// }));

// // ----------------------------------------------------------------------

// HomePage.getLayout = function getLayout(page) {
//   return <Layout variant="logoOnly">{page}</Layout>;
// };

// // ----------------------------------------------------------------------

// export default function HomePage() {
//   return (
//     <RoleBasedGuard accessibleRoles={['admin']}>
//       <Page title="The starting point for your next project">
//         <RootStyle>
//           <HomeHero />
//           <ContentStyle>
//             <HomeMinimal />

//             <HomeHugePackElements />

//             <HomeDarkMode />

//             <HomeColorPresets />

//             <HomeCleanInterfaces />

//             <HomePricingPlans />

//             <HomeLookingFor />

//             <HomeAdvertisement />
//           </ContentStyle>
//         </RootStyle>
//       </Page>
//     </RoleBasedGuard>
//   );
// }


// /src/pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuth from '../hooks/useAuth';

// ----------------------------------------------------------------------

export default function HomePage() {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized) {
      if (isAuthenticated) {
        router.push('/dashboard/app');
      } else {
        router.push('/auth/login');
      }
    }
  }, [isAuthenticated, isInitialized, router]);

  return null; // No need to render anything as we are redirecting
}

import styled from '@emotion/styled';
import DesktopNav from 'components/navigations';
import { Box } from '@chakra-ui/layout';
import { Grid } from '@chakra-ui/react';
import MobileNav from 'components/navigations/mobileNav';

const navLinks = [
  {
    name: 'Dashboard',
    url: '/',
  },
  {
    name: 'Products',
    url: '/products',
  },
  {
    name: 'Orders',
    url: '/orders',
  },
];

const DashboardLayout: React.FC = ({ children }) => {
  return (
    <StyledLayout>
      <DesktopNav links={navLinks}></DesktopNav>
      <Box>{children}</Box>
      <MobileNav links={navLinks} />
    </StyledLayout>
  );
};

export default DashboardLayout;

const StyledLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 60px 1fr;
  min-height: 100vh;
  .mobile-nav {
    display: grid;
    background: black;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
  @media (min-width: 811px) {
    .mobile-nav {
      display: none;
    }
    grid-template-columns: 241px 1fr;
    grid-template-rows: 1fr;
  }
`;

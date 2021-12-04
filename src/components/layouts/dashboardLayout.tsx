import styled from '@emotion/styled';
import SideNav from 'components/sideNav';
import { Box } from '@chakra-ui/layout';

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
      <SideNav links={navLinks}></SideNav>
      <Box>{children}</Box>
    </StyledLayout>
  );
};

export default DashboardLayout;

const StyledLayout = styled.div`
  display: grid;
  grid-template-columns: 241px 1fr;
  min-height: 100vh;
`;

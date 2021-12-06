import { Grid, Box } from '@chakra-ui/react';
import { INavigation } from './desktopNav';
import Image from 'next/image';
import Link from 'next/link';

const MobileNav = ({ links }: INavigation) => {
  const baseUrl = '/app/dashboard';
  return (
    <Grid templateColumns='repeat(3, 1fr)' gap={1} className='mobile-nav'>
      {links &&
        links.map(({ name, url }, index) => (
          <Box
            key={index + name}
            w='100%'
            h='60px'
            color='white'
            display='flex'
            fontSize='12px'
            alignItems='center'
            justifyContent='center'>
            <Link href={`${baseUrl}${url}`}>
              <a>
                {/* <Image
                  src='/dashboardHomeIcon.svg'
                  alt='Qua logo'
                  layout='fixed'
                  width={24}
                  height={24}
                /> */}
                {name}
              </a>
            </Link>
          </Box>
        ))}
    </Grid>
  );
};

export default MobileNav;

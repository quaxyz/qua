import styled from '@emotion/styled';
import { Box } from '@chakra-ui/layout';
import Link from 'next/link';

import { useRouter } from 'next/router';
import Image from 'next/image';

interface INavLink {
  name: string;
  url: string;
}
interface ISideNav {
  links: INavLink[];
}

const SideNav = ({ links }: ISideNav) => {
  const baseUrl = '/app/dashboard';
  return (
    <StyledSideNav>
      <div>
        <h1>Frowth</h1>
      </div>

      <div className='links-section'>
        {links &&
          links.map(({ name, url }, index) => (
            <Link href={`${baseUrl}${url}`} key={index + name}>
              <a>
                <Image
                  src='/dashboardHomeIcon.svg'
                  alt='Qua logo'
                  layout='fixed'
                  width={24}
                  height={24}
                />
                {name}
              </a>
            </Link>
          ))}
      </div>
    </StyledSideNav>
  );
};

export default SideNav;

const StyledSideNav = styled(Box)`
  background: black;
  padding: 24px;
  div {
    h1 {
      font-family: Inter;
      font-style: normal;
      font-weight: 800;
      font-size: 24px;
      line-height: 29px;
      color: #ffffff;
    }
  }
  .links-section {
    padding-top: 40px;
    display: flex;
    flex-direction: column;
    a {
      color: #ffffff;
      padding: 12px 16px 12px 16px;
      border-radius: 4px;

      :hover {
        background: #ffffff;
        color: black;
      }
    }
  }
`;

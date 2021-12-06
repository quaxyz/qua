import styled from '@emotion/styled';
import { Box } from '@chakra-ui/layout';
import Link from 'next/link';
import { Button } from '@chakra-ui/react';

import { useRouter } from 'next/router';
import Image from 'next/image';

interface INavLink {
  name: string;
  url: string;
}
export interface INavigation {
  links: INavLink[];
}

const DesktopNav = ({ links }: INavigation) => {
  const baseUrl = '/app/dashboard';
  return (
    <StyledSideNav>
      <section className='nav'>
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
      </section>
      <section className='address'>
        <Button colorScheme='whiteAlpha' width='100%' variant='outline'>
          0x9Ca9...43aA
        </Button>
      </section>
    </StyledSideNav>
  );
};

export default DesktopNav;

const StyledSideNav = styled(Box)`
  background: black;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .nav {
    div {
      h1 {
        font-family: Inter;
        font-style: normal;
        font-weight: 800;
        font-size: 18px;
        line-height: 22px;
        color: #ffffff;
      }
    }
    .links-section {
      display: none;
      padding-top: 40px;
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
  }

  .address {
    button {
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.16);
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 19px;
    }
  }

  @media (min-width: 811px) {
    padding: 24px;
    flex-direction: column;
    .nav {
      div {
        h1 {
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
    }

    .address {
      button {
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.16);
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 19px;
      }
    }
  }
`;

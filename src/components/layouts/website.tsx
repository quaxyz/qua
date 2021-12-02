import { Button, Tab, TabList, Tabs } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'

const WebsiteLayout = (props: { children: any }) => {
  return (
    <div>
      <style jsx>{`
        ul {
          list-style-type: none;
        }
        nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4rem 0 4rem;
          width: 100%;
        }

        footer {
          background: #000000;
          color: #ffffff;
          margin: 1rem;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 697px;
        }

        .footer-list-items {
          display: grid;
          grid-template-areas: 'a a a a';
          gap: 2rem;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          width: 100%;
          position: absolute;
          bottom: 0;
        }
      `}</style>
      <header>
        <nav>
          <Link href="/">
            <a>
              <Image
                src="/logo.svg"
                alt="Qua logo"
                layout="fixed"
                width={100}
                height={100}
              />
            </a>
          </Link>
          <Tabs colorScheme="#000000">
            <TabList border="none">
              <Tab p="0" mr="8">
                <Link href="/">
                  <a>Home</a>
                </Link>
              </Tab>

              <Tab p="0">
                <Link href="/stores">
                  <a>P2P Stores</a>
                </Link>
              </Tab>
            </TabList>
          </Tabs>
          <Button key="metamask-install" size="md" variant="outline">
            Connect wallet
          </Button>
        </nav>
        <hr />
      </header>

      <main>{props.children}</main>

      <div className="footer-container">
        <footer>
          <Image
            src="/qua-mark-white.svg"
            alt="Qua Mark"
            layout="fixed"
            width={150}
            height={150}
          />

          <ul className="footer-list-items">
            <Link href="/about">
              <a>
                <li>About qua.xyz</li>
              </a>
            </Link>
            <Link href="/terms">
              <a>
                <li>Terms of use</li>
              </a>
            </Link>
            <Link href="/privacy">
              <a>
                <li>Privacy Policy</li>
              </a>
            </Link>
            <Link href="/faq">
              <a>
                <li>FAQ</li>
              </a>
            </Link>
          </ul>
        </footer>
      </div>
    </div>
  )
}

export default WebsiteLayout

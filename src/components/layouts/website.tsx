import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'

export default function WebsiteLayout(props: { children: any; title: string }) {
  useEffect(() => {
    document.title = `${props.title} - Qua`
  }, [props.title])

  return (
    <div>
      <header>
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
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/store">
              <a>Store</a>
            </Link>
          </li>
        </ul>
        <button>Connect wallet</button>
      </header>

      <main>{props.children}</main>

      <footer style={{ background: '#000000', color: '#fffff' }}>
        <Image
          src="/qua-mark-white.svg"
          alt="Qua Mark"
          layout="fixed"
          width={150}
          height={150}
        />

        <ul>
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
  )
}

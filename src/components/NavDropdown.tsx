'use client';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { IoIosArrowDown } from 'react-icons/io';
import { FiMenu } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
import { useAutoAnimate } from '@formkit/auto-animate/react';

type NavItem = {
  label: string;
  link?: string;
  children?: NavItem[];
  iconImage?: string;
};

const navItems: NavItem[] = [
  {
    label: 'Programs',
    children: [
      { label: 'Math', link: '#' },
      { label: 'Tamil', link: '/tamil' },
      // { label: 'Public Speaking', link: '#' },
    ],
  },
  {
    label: 'Pricing',
    children: [{ label: 'Subscription Plans', link: '/plans' }],
  },
  {
    label: 'Student Corner',
    children: [
      { label: 'Online Events', link: '/onlineEvent' },
      // { label: 'Summer Camp', link: '#' },
      // { label: 'Contest', link: '#' },
    ],
  },
  {
    label: 'About',
    children: [
      { label: 'History', link: '/history' },
      { label: 'Our Team', link: '/ourTeam' },
      { label: 'Blog', link: '/blog' },
    ],
  },
];

export default function NavDropdown() {
  const [animationParent] = useAutoAnimate();
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-7xl justify-between px-4 py-5 text-sm">
      {/* left */}
      <section ref={animationParent} className="flex items-center gap-10">
        {isSideMenuOpen && <MobileNav closeSideMenu={() => setSideMenuOpen(false)} />}
        <div className="hidden md:flex items-center gap-4 transition-all">
          {navItems.map((d, i) =>
            d.children ? (
              <div key={i} className="relative group px-2 py-3">
                <p className="flex cursor-pointer items-center gap-2 text-black font-semibold text-base md:text-lg group-hover:text-neutral-400">
                  {d.label}
                  <IoIosArrowDown className="rotate-180 transition-all group-hover:rotate-0" />
                </p>
                <div className="absolute z-50 right-0 top-10 hidden w-auto flex-col gap-1 rounded-lg bg-white py-3 shadow-md transition-all group-hover:flex">
                  {d.children.map((ch, j) => (
                    <Link
                      key={j}
                      href={ch.link ?? '#'}
                      className="flex cursor-pointer items-center py-1 pl-6 pr-8 text-black font-semibold text-base md:text-lg hover:text-neutral-400"
                    >
                      {ch.iconImage && <Image src={ch.iconImage} alt="item-icon" />}
                      <span className="pl-3 whitespace-nowrap">{ch.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={i}
                href={d.link ?? '#'}
                className="px-2 py-3 text-black font-semibold text-base md:text-lg hover:text-neutral-400 transition-all"
              >
                {d.label}
              </Link>
            )
          )}
        </div>
      </section>

      {/* right */}
      <section className="hidden md:flex items-center gap-8">
        <button className="text-black font-semibold text-base md:text-lg hover:text-neutral-400">
          <Link href="/register">SignUp</Link>
        </button>
        <button className="text-black font-semibold text-base md:text-lg hover:text-neutral-400">
          <Link href="/login">Login</Link>
        </button>
        <button className="rounded-xl border-2 border-black px-4 py-2 text-black font-semibold text-base md:text-lg hover:border-neutral-400 hover:text-neutral-400">
          <Link href="/login">Try Free Class</Link>
        </button>
      </section>

      <FiMenu
        onClick={() => setSideMenuOpen(true)}
        className="cursor-pointer text-4xl md:hidden"
      />
    </div>
  );
}

function MobileNav({ closeSideMenu }: { closeSideMenu: () => void }) {
  return (
    <div className="fixed left-0 top-0 z-[100] flex h-full min-h-screen w-full justify-end bg-black/50 md:hidden">
      <div className="h-full w-[65%] bg-white px-4 py-4">
        <section className="flex justify-end">
          <AiOutlineClose onClick={closeSideMenu} className="cursor-pointer text-4xl" />
        </section>
        <div className="flex flex-col text-base gap-2">
          {navItems.map((d, i) => (
            <SingleNavItem key={i} {...d} />
          ))}
        </div>
        <section className="mt-4 flex flex-col items-center gap-8">
          <button className="text-black font-semibold text-base hover:text-neutral-400">
            <Link href="/register">SignUp</Link>
          </button>
          <button className="text-black font-semibold text-base hover:text-neutral-400">
            <Link href="/login">Login</Link>
          </button>
          <button className="w-full max-w-[200px] rounded-xl border-2 border-black px-4 py-2 text-black font-semibold text-base hover:border-neutral-400 hover:text-neutral-400">
            <Link href="/login">Try Free Class</Link>
          </button>
        </section>
      </div>
    </div>
  );
}

function SingleNavItem(d: NavItem) {
  const [animationParent] = useAutoAnimate();
  const [isItemOpen, setItemOpen] = useState(false);

  const toggleItem = () => setItemOpen((prev) => !prev);

  return (
    <div ref={animationParent}>
      <div
        onClick={toggleItem}
        className="flex justify-between items-center px-2 py-3 cursor-pointer text-black font-semibold text-base md:text-lg"
      >
        <span>{d.label}</span>
        {d.children && (
          <IoIosArrowDown
            className={`transition-transform ${isItemOpen ? 'rotate-180' : ''}`}
          />
        )}
      </div>
      {isItemOpen && d.children && (
        <div className="flex flex-col gap-1 bg-white py-3 pl-4">
          {d.children.map((ch, i) => (
            <Link
              key={i}
              href={ch.link ?? '#'}
              className="flex items-center py-1 pr-8 text-black font-semibold text-base hover:text-neutral-400"
            >
              {ch.iconImage && <Image src={ch.iconImage} alt="item-icon" />}
              <span className="pl-3 whitespace-nowrap">{ch.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
'use client'; 
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { IoIosArrowDown } from 'react-icons/io';
import { FiMenu } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import LanguageToggle from "@/components/LanguageToggle"; 

type NavItem = {
  label: string;
  link?: string;
  children?: NavItem[];
  iconImage?: string;
};

const navItems: NavItem[] = [
  {
    label: 'Home', link: '/landingPage'
  },
  // {
  //   label: 'Programs',
  //   children: [
  //     { label: 'Tamil', link: '/tamil' },
  //   ],
  // },
  {
    label: 'Plans', link: '/plans'
  },
  {
    label: 'About', link: '/history'
  },
];

export default function NavDropdown() {
  const [animationParent] = useAutoAnimate();
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);

return (
  <div className="sticky top-0 z-50 bg-white shadow-md">
  <div className="container mx-auto flex w-full justify-between items-center px-4 h-20 md:h-24">
    {/* Logo */}
    <Link href="/" className="flex items-center h-full">
      <Image
        src="/utalogo.png"
        alt="Logo"
        width={260}   
        height={90}
        priority
        className="object-contain h-full w-auto"
      />
    </Link>

    {/* left */}
    <section ref={animationParent} className="flex items-center gap-10">
      {isSideMenuOpen && <MobileNav closeSideMenu={() => setSideMenuOpen(false)} />}
      <div className="hidden md:flex items-center gap-4 transition-all">
        {navItems.map((d, i) =>
          d.children ? (
            <div key={i} className="relative group px-2 py-3">
              <p className="flex cursor-pointer items-center gap-2 text-black font-semibold text-lg md:text-xl group-hover:text-blue-600">
                {d.label}
                <IoIosArrowDown className="rotate-180 transition-all group-hover:rotate-0" />
              </p>
              <div className="absolute z-50 right-0 top-10 hidden w-auto flex-col gap-1 rounded-lg bg-white py-3 shadow-md transition-all group-hover:flex">
                {d.children.map((ch, j) => (
                  <Link
                    key={j}
                    href={ch.link ?? '#'}
                    className="flex cursor-pointer items-center py-1 pl-6 pr-8 text-black font-semibold text-lg md:text-xl hover:text-blue-600"
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
              className="px-2 py-3 text-black font-semibold text-lg md:text-xl hover:text-blue-600 transition-all"
            >
              {d.label}
            </Link>
          )
        )}
      </div>
    </section>

    {/* right */}
    <section className="hidden md:flex items-center gap-8">
      <button className="text-black font-semibold text-lg md:text-xl hover:text-blue-600">
        <Link href="/register">Register</Link>
      </button>
      <button className="text-black font-semibold text-lg md:text-xl hover:text-blue-600">
        <Link href="/login">Login</Link>
      </button>
      <button className="rounded-xl border-2 border-black px-4 py-2 text-black font-semibold text-lg md:text-xl hover:border-neutral-400 hover:text-blue-600">
        <Link href="/login">Try Free Class</Link>
      </button>
    </section>

    <FiMenu
      onClick={() => setSideMenuOpen(true)}
      className="cursor-pointer text-4xl md:hidden"
    />
  </div>
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
        <div className="flex flex-col text-lg gap-2">
          {navItems.map((d, i) => (
            <MobileNavItem key={i} {...d} closeSideMenu={closeSideMenu} />
          ))}
        </div>
        <section className="mt-4 flex flex-col items-center gap-8">
          {/* <LanguageToggle /> */}
          <button className="text-black font-semibold text-lg hover:text-blue-600">
            <Link href="/register" onClick={closeSideMenu}>Register</Link>
          </button>
          <button className="text-black font-semibold text-lg hover:text-blue-600">
            <Link href="/login" onClick={closeSideMenu}>Login</Link>
          </button>
          <button className="w-full max-w-[200px] rounded-xl border-2 border-black px-4 py-2 text-black font-semibold text-lg hover:border-neutral-400 hover:text-blue-600">
            <Link href="/login" onClick={closeSideMenu}>Try Free Class</Link>
          </button>
        </section>
      </div>
    </div>
  );
}

function MobileNavItem(d: NavItem & { closeSideMenu: () => void }) {
  const [animationParent] = useAutoAnimate();
  const [isItemOpen, setItemOpen] = useState(false);

  const toggleItem = () => setItemOpen((prev) => !prev);

  // Handle direct navigation for items without children
  const handleNavigation = () => {
    if (!d.children && d.link) {
      d.closeSideMenu();
    }
  };

  return (
    <div ref={animationParent}>
      {d.children ? (
        <>
          <div
            onClick={toggleItem}
            className="flex justify-between items-center px-2 py-3 cursor-pointer text-black font-semibold text-lg md:text-xl"
          >
            <span>{d.label}</span>
            <IoIosArrowDown
              className={`transition-transform ${isItemOpen ? 'rotate-180' : ''}`}
            />
          </div>
          {isItemOpen && d.children && (
            <div className="flex flex-col gap-1 bg-white py-3 pl-4">
              {d.children.map((ch, i) => (
                <Link
                  key={i}
                  href={ch.link ?? '#'}
                  onClick={d.closeSideMenu}
                  className="flex items-center py-1 pr-8 text-black font-semibold text-lg hover:text-neutral-400"
                >
                  {ch.iconImage && <Image src={ch.iconImage} alt="item-icon" />}
                  <span className="pl-3 whitespace-nowrap">{ch.label}</span>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          href={d.link ?? '#'}
          onClick={handleNavigation}
          className="flex justify-between items-center px-2 py-3 cursor-pointer text-black font-semibold text-lg md:text-xl"
        >
          {d.label}
        </Link>
      )}
    </div>
  );
}
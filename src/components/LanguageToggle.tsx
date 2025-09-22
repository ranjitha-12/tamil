'use client';
import { usePathname, useRouter } from "next/navigation";

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (lang: string) => {
    const newPath = `/${lang}${pathname.replace(/^\/(en|ta)/, "")}`;
    router.push(newPath);
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => changeLanguage("en")} className="px-3 py-1 border rounded">
        English
      </button>
      <button onClick={() => changeLanguage("ta")} className="px-3 py-1 border rounded">
        தமிழ்
      </button>
    </div>
  );
}
